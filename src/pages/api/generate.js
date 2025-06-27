
// src/pages/api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product, audience, tone } = req.body;

  if (!product || !audience || !tone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if OpenAI API key is configured
    const openAiKey = process.env.OPENAI_API_KEY;
    
    if (!openAiKey) {
      // Return a structured response indicating missing API key
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set up your API key in the environment variables.',
        code: 'MISSING_API_KEY'
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
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: 'No response from OpenAI API' });
    }

    const aiText = data.choices[0].message.content;
    
    // Log successful generation for debugging
    console.log('Email generated successfully for:', { product: product.substring(0, 50), audience, tone });
    
    res.status(200).json({ 
      result: aiText,
      usage: data.usage // Include token usage for monitoring
    });

  } catch (err) {
    console.error('OpenAI API error:', err);
    
    // Provide more specific error messages
    if (err.message.includes('API key')) {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    }
    
    if (err.message.includes('quota')) {
      return res.status(429).json({ error: 'OpenAI API quota exceeded' });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate email. Please try again.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
