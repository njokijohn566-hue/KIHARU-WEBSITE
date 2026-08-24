const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

// Student routes
router.get('/me', authenticate, studentController.getProfile);

router.get(
  '/profile-stats',
  authenticate,
  studentController.getProfileWithStats
);

router.put(
  '/profile',
  authenticate,
  studentController.updateProfile
);

// Admin routes
router.get(
  '/admin',
  authenticate,
  authorize(['admin']),
  studentController.getAllStudents
);

router.get(
  '/admin/:studentId',
  authenticate,
  authorize(['admin']),
  studentController.getStudentById
);

router.put(
  '/admin/:studentId',
  authenticate,
  authorize(['admin']),
  studentController.updateStudentByAdmin
);

router.patch(
  '/admin/:studentId/status',
  authenticate,
  authorize(['admin']),
  studentController.updateStudentStatus
);

module.exports = router;