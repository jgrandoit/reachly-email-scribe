
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-EMAIL] ${step}${detailsStr}`);
};

// Define usage limits per tier
const USAGE_LIMITS = {
  free: 10,
  starter: 50,
  pro: -1 // unlimited
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Create Supabase client with service role for database operations
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");
    
    const requestBody = await req.json();
    const { prompt, product, audience, tone, customHook, framework } = requestBody;

    // Support both new prompt-based system and legacy system
    if (!prompt && (!product || !audience || !tone)) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      logStep("Authentication failed", { error: userError?.message });
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user's subscription status
    const { data: subscriberData } = await supabaseClient
      .from('subscribers')
      .select('subscribed, subscription_tier')
      .eq('user_id', user.id)
      .single();

    const userTier = subscriberData?.subscribed ? 
      (subscriberData.subscription_tier?.toLowerCase() || 'starter') : 'free';
    logStep("User tier determined", { tier: userTier });

    // Get current usage
    const { data: currentUsage } = await supabaseClient
      .rpc('get_user_monthly_usage', { p_user_id: user.id });

    const usageCount = currentUsage || 0;
    const limit = USAGE_LIMITS[userTier as keyof typeof USAGE_LIMITS];
    
    logStep("Usage check", { current: usageCount, limit, tier: userTier });

    // Check if user has exceeded their limit
    if (limit !== -1 && usageCount >= limit) {
      return new Response(JSON.stringify({ 
        error: 'Monthly usage limit exceeded',
        code: 'USAGE_LIMIT_EXCEEDED',
        current_usage: usageCount,
        limit: limit,
        tier: userTier
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if OpenAI API key is configured
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAiKey) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured. Please set up your API key in the environment variables.',
        code: 'MISSING_API_KEY'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use the provided prompt or generate a legacy one
    let finalPrompt = prompt;
    if (!prompt) {
      // Legacy system fallback
      const variantCount = userTier === 'free' ? 2 : userTier === 'starter' ? 3 : 5;
      finalPrompt = `You are an expert cold email copywriter. Your task is to write compelling, personalized cold emails that get responses.

Write ${variantCount} short cold email variants in a ${tone} tone promoting this product/service: "${product}" 

Target audience: "${audience}"

Requirements:
- Include compelling subject lines for each email
- Personalize the opening line
- Focus on benefits, not features
- Include a clear call to action
- Make each email distinct in approach
- Keep each email under 150 words`;
    }

    logStep('Generating email with OpenAI', { promptLength: finalPrompt.length });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return new Response(JSON.stringify({ error: 'No response from OpenAI API' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiText = data.choices[0].message.content;
    
    // Extract subject line from the generated content (assuming it's on the first line)
    const lines = aiText.split('\n');
    const subjectLine = lines.find(line => line.toLowerCase().includes('subject:') || line.toLowerCase().includes('subject line:'))
      ?.replace(/subject:?\s*/i, '').trim() || lines[0]?.trim();
    
    // Store the generated email in the database
    const { error: insertError } = await supabaseClient
      .from('generated_emails')
      .insert({
        user_id: user.id,
        subject_line: subjectLine,
        email_content: aiText,
        product_service: product || 'Generated via prompt',
        target_audience: audience || 'Custom audience',
        tone: tone || 'professional',
        custom_hook: customHook || null,
        framework: framework || 'custom'
      });

    if (insertError) {
      console.error('Error storing generated email:', insertError);
      // Don't fail the request if storage fails, but log it
    }
    
    // Increment user usage
    await supabaseClient.rpc('increment_user_usage', { p_user_id: user.id });
    logStep('Usage incremented', { newUsage: usageCount + 1 });
    
    // Log successful generation for debugging
    logStep('Email generated successfully', { 
      promptType: prompt ? 'framework-based' : 'legacy',
      usage: usageCount + 1
    });
    
    return new Response(JSON.stringify({ 
      result: aiText,
      usage: data.usage,
      user_usage: {
        current: usageCount + 1,
        limit: limit,
        tier: userTier
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('OpenAI API error:', err);
    
    // Provide more specific error messages
    if (err.message.includes('API key')) {
      return new Response(JSON.stringify({ error: 'Invalid OpenAI API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (err.message.includes('quota')) {
      return new Response(JSON.stringify({ error: 'OpenAI API quota exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate email. Please try again.',
      details: err.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
