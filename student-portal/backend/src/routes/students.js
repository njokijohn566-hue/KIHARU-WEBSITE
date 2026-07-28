const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, studentController.getProfile);
router.get('/profile-stats', authenticate, studentController.getProfileWithStats);
router.put('/profile', authenticate, studentController.updateProfile);

module.exports = router;
