const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, coursesController.getAvailableCourses);
router.get('/:courseId', authenticate, coursesController.getCourseDetails);
router.get('/enrolled', authenticate, coursesController.getEnrolledCourses);

module.exports = router;
