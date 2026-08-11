
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const rateLimit = require('express-rate-limit');

// Basic IP-based rate limiter for the public AI endpoint
const aiLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 20, // limit each IP to 20 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		return res.status(429).json({ success: false, message: 'Too many AI requests. Please wait a moment and try again.' });
	}
});

router.get('/health', aiController.health);
router.post('/chat', aiLimiter, aiController.chat);

module.exports = router;
