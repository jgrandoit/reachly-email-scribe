
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
  console.log(`[EMAIL-ANALYZER] ${step}${detailsStr}`);
};

// Helper function to extract JSON from markdown code blocks
const extractJsonFromResponse = (response: string): string => {
  // Remove markdown code blocks if present
  const jsonMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  // If no code blocks, return the response as-is
  return response.trim();
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
    logStep("Email analysis function started");
    
    const requestBody = await req.json();
    const { email_content, email_type } = requestBody;

    if (!email_content) {
      return new Response(JSON.stringify({ 
        error: 'Email content is required',
        code: 'MISSING_EMAIL_CONTENT'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      logStep("Authentication failed", { error: userError?.message });
      return new Response(JSON.stringify({ 
        error: 'Invalid authentication',
        code: 'INVALID_AUTHENTICATION'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check for test mode in query parameters
    const url = new URL(req.url);
    const testMode = url.searchParams.get('test') === 'true';
    const testTier = url.searchParams.get('tier') || null;
    
    let userTier = 'free';
    
    if (testMode && testTier) {
      userTier = testTier;
      logStep("Test mode detected", { testTier });
    } else {
      // Check actual subscription status
      const { data: subscriberData } = await supabaseClient
        .from('subscribers')
        .select('subscribed, subscription_tier')
        .eq('user_id', user.id)
        .single();

      userTier = subscriberData?.subscribed ? 
        (subscriberData.subscription_tier?.toLowerCase() || 'starter') : 'free';
    }
    
    if (userTier !== 'pro') {
      logStep("Pro subscription required", { currentTier: userTier });
      return new Response(JSON.stringify({ 
        error: 'Pro subscription required for email analysis',
        code: 'PRO_REQUIRED',
        current_tier: userTier
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    logStep("Pro user verified", { tier: userTier });

    // Check if OpenAI API key is configured
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAiKey) {
      logStep("OpenAI API key missing");
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        code: 'MISSING_API_KEY'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create analysis prompt
    const analysisPrompt = `You are an expert cold email analyst. Analyze the following cold email and provide a detailed scoring and feedback.

Email to analyze:
"""
${email_content}
"""

Please provide your analysis in the exact JSON format below (no additional text or markdown formatting):

{
  "overall_score": <number 0-100>,
  "tone_score": <number 0-100>,
  "structure_score": <number 0-100>,
  "clarity_score": <number 0-100>,
  "spam_score": <number 0-100 where higher means more spammy>,
  "suggestions": [
    "<specific actionable improvement suggestion>",
    "<another suggestion>"
  ],
  "strengths": [
    "<what the email does well>",
    "<another strength>"
  ],
  "red_flags": [
    "<potential issues or spam triggers>",
    "<another red flag>"
  ]
}

Scoring criteria:
- Tone (0-100): Professional yet personable, appropriate for cold outreach
- Structure (0-100): Clear opening, value proposition, call to action
- Clarity (0-100): Easy to understand, concise, well-written
- Spam Score (0-100): Higher score = more likely to be flagged as spam

Focus on practical, actionable feedback that will improve response rates.`;

    logStep('Analyzing email with GPT-4o', { emailLength: email_content.length });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Use GPT-4o for Pro users
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep('OpenAI API error', { status: response.status, error: errorText });
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'OpenAI API rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    logStep('OpenAI response received', data);

    if (!data.choices || !data.choices.length) {
      logStep('No choices in OpenAI response', data);
      return new Response(JSON.stringify({ 
        error: 'No response from OpenAI API',
        code: 'NO_RESPONSE'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = data.choices[0].message.content;
    logStep('AI response content', { content: aiResponse });
    
    try {
      // Extract JSON from potential markdown code blocks
      const cleanJsonString = extractJsonFromResponse(aiResponse);
      logStep('Cleaned JSON string', { cleanedContent: cleanJsonString });
      
      // Parse the JSON response from GPT
      const analysis = JSON.parse(cleanJsonString);
      
      // Validate the analysis structure
      if (typeof analysis.overall_score !== 'number' || 
          !Array.isArray(analysis.suggestions) || 
          !Array.isArray(analysis.strengths)) {
        throw new Error('Invalid analysis format');
      }

      // Store the analysis in the database (if not in test mode)
      if (!testMode) {
        const { error: insertError } = await supabaseClient
          .from('email_analysis')
          .insert({
            user_id: user.id,
            email_content: email_content,
            email_type: email_type || 'unknown',
            overall_score: analysis.overall_score,
            tone_score: analysis.tone_score || 0,
            structure_score: analysis.structure_score || 0,
            clarity_score: analysis.clarity_score || 0,
            spam_score: analysis.spam_score || 0,
            suggestions: analysis.suggestions,
            strengths: analysis.strengths,
            red_flags: analysis.red_flags || []
          });

        if (insertError) {
          logStep('Error storing analysis', insertError);
        }
      }
      
      logStep('Email analysis completed successfully', { 
        score: analysis.overall_score,
        suggestionsCount: analysis.suggestions.length
      });
      
      return new Response(JSON.stringify({ 
        analysis,
        usage: data.usage
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (parseError) {
      logStep('Error parsing AI response', { error: parseError.message, response: aiResponse });
      
      return new Response(JSON.stringify({ 
        error: 'Failed to parse analysis results',
        code: 'PARSE_ERROR',
        raw_response: aiResponse
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (err) {
    logStep('Email analysis error', err);
    
    if (err.message.includes('API key')) {
      return new Response(JSON.stringify({ 
        error: 'Invalid OpenAI API key',
        code: 'INVALID_API_KEY'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (err.message.includes('quota') || err.message.includes('rate limit')) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API quota exceeded',
        code: 'QUOTA_EXCEEDED'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze email. Please try again.',
      code: 'ANALYSIS_ERROR',
      details: err.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
