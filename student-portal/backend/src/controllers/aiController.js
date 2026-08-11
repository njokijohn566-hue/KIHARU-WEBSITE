const aiService = require('../services/aiService');

exports.health = async (req, res) => {
  const status = aiService.getHealthStatus();
  res.json({
    success: true,
    service: 'Kiharu AI',
    status,
  });
};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const trimmed = message.trim();
    const MAX_MESSAGE_LENGTH = 1000;
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ success: false, message: 'Your message is too long. Please keep it under 1000 characters.' });
    }

    const reply = await aiService.chat(trimmed);

    res.json({ success: true, message: reply });
  } catch (error) {
    // Log minimally but do not leak internal details to clients
    console.error('AI chat error:', error && error.message ? error.message : error);
    res.status(500).json({ success: false, message: 'AI service error' });
  }
};
