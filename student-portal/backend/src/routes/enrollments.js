const express = require('express');
const router = express.Router();

const enrollmentController = require('../controllers/enrollmentController');
const { authenticate, authorize } = require('../middleware/auth');

// Admin routes
router.get(
  '/admin',
  authenticate,
  authorize(['admin']),
  enrollmentController.getAdminEnrollments
);

// Student routes
router.post('/', authenticate, enrollmentController.registerCourse);
router.delete('/:courseId', authenticate, enrollmentController.dropCourse);

module.exports = router;