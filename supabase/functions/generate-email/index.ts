
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

  try {
    const { product, audience, tone } = await req.json();

    if (!product || !audience || !tone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
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

    // Construct a detailed prompt for better email generation
    const systemPrompt = `You are an expert cold email copywriter. Your task is to write compelling, personalized cold emails that get responses. Focus on:
    1. Creating attention-grabbing subject lines
    2. Opening with relevance to the recipient
    3. Clearly stating the value proposition
    4. Including a specific, low-friction call to action
    5. Keeping it concise (under 150 words)
    
    Format your response with:
    - Subject line
    - Email body
    - Clear call to action`;

    const userPrompt = `Write 2 short cold email variants in a ${tone} tone promoting this product/service: "${product}" 
    
    Target audience: "${audience}"
    
    Requirements:
    - Include compelling subject lines for each email
    - Personalize the opening line
    - Focus on benefits, not features
    - Include a clear call to action
    - Make each email distinct in approach
    - Keep each email under 150 words`;

    console.log('Generating email with OpenAI...');

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
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
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
    
    // Log successful generation for debugging
    console.log('Email generated successfully for:', { product: product.substring(0, 50), audience, tone });
    
    return new Response(JSON.stringify({ 
      result: aiText,
      usage: data.usage // Include token usage for monitoring
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
