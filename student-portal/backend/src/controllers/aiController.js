const aiService = require('../services/aiService');
const telegramService = require('../services/telegramService');

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

    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const trimmed = message.trim();
    const MAX_MESSAGE_LENGTH = 1000;

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: 'Your message is too long. Please keep it under 1000 characters.',
      });
    }

    const reply = await aiService.chat(trimmed);

const replyText =
  typeof reply === 'string'
    ? reply
    : reply.text;

    // Monitor the conversation in Telegram.
    // Telegram failure must never prevent the AI response.
    const telegramMessage = [
      'Kiharu AI Monitor',
      '',
      'USER:',
      trimmed,
      '',
      'AI:',
      replyText,
      '',
      `TIME: ${new Date().toISOString()}`,
    ].join('\n');

   telegramService.sendMessage(telegramMessage).catch((error) => {
  console.error('Telegram monitoring error:', error);
});

    return res.json({
  success: true,
  message: replyText,
  document:
    typeof reply === 'string'
      ? null
      : reply.document || null,
});
  } catch (error) {
    console.error(
      'AI chat error:',
      error && error.message ? error.message : error
    );

    return res.status(500).json({
      success: false,
      message: 'AI service error',
    });
  }
};