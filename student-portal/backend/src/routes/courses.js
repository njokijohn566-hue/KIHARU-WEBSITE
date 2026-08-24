const express = require('express');

const router = express.Router();

const coursesController = require('../controllers/coursesController');

const { authenticate, authorize } = require('../middleware/auth');

// Student routes

router.get('/enrolled', authenticate, coursesController.getEnrolledCourses);

router.get('/', authenticate, coursesController.getAvailableCourses);

// Admin routes

router.get(
  '/admin',
  authenticate,
  authorize(['admin']),
  coursesController.getAdminCourses
);

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  coursesController.createCourse
);

router.put(
  '/:courseId',
  authenticate,
  authorize(['admin']),
  coursesController.updateCourse
);

router.delete(
  '/:courseId',
  authenticate,
  authorize(['admin']),
  coursesController.deleteCourse
);

// Course details

router.get('/:courseId', authenticate, coursesController.getCourseDetails);

module.exports = router;