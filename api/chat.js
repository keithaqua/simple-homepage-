export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages = [] } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(200).json({ reply: 'Missing OPENAI_API_KEY in Vercel → Settings → Environment Variables.' });
      return;
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI assistant for a Seattle Eastside real estate website. Be concise, friendly, and practical. No legal or financial advice.' },
          ...messages
        ].slice(-12)
      })
    });

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || 'I can help compare neighborhoods, budgets, and savings.';
    res.status(200).json({ reply });
  } catch (e) {
    res.status(200).json({ reply: 'Sorry—something went wrong. Please try again.' });
  }
}
