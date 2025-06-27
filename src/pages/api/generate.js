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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a cold email copywriter.'
          },
          {
            role: 'user',
            content: `Write 2 short cold emails in a ${tone} tone promoting this: "${product}" to this audience: "${audience}". Include subject lines and a call to action.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: 'No response from OpenAI' });
    }

    const aiText = data.choices[0].message.content;
    res.status(200).json({ result: aiText });

  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
