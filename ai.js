const express = require('express');
const router = express.Router();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && typeof m === 'object')
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
      content: String(m.content || '').slice(0, 4000)
    }))
    .filter((m) => m.content.length > 0)
    .slice(-12);
}

router.post('/chat', async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({
        error: 'AI is not configured. Set OPENROUTER_API_KEY in backend .env file.'
      });
    }

    const message = String(req.body?.message || '').trim();
    const language = String(req.body?.language || 'en').toLowerCase();
    const context = String(req.body?.context || '').trim();
    const history = cleanMessages(req.body?.history);

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const systemPrompt = [
      'You are VidyaAI Tutor for Indian class 6-12 STEM students.',
      'Keep explanations clear, accurate, and friendly.',
      'Use short paragraphs and bullet points when useful.',
      language === 'hi' ? 'Reply mostly in Hindi with simple terms.' : 'Reply in English.',
      context ? `Context: ${context}` : ''
    ]
      .filter(Boolean)
      .join(' ');

    const payload = {
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ],
      temperature: 0.4,
      max_tokens: 600
    };

    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5000',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'VidyaAI'
      },
      body: JSON.stringify(payload)
    });

    const data = await upstream.json().catch(() => ({}));
    const reply = data?.choices?.[0]?.message?.content;

    if (!upstream.ok || !reply) {
      const messageText = data?.error?.message || 'Failed to get AI response from provider.';
      return res.status(upstream.status || 502).json({ error: messageText });
    }

    return res.json({ reply, model: data?.model || DEFAULT_MODEL });
  } catch (error) {
    console.error('AI chat error:', error);
    return res.status(500).json({ error: 'Internal AI service error.' });
  }
});

module.exports = router;
