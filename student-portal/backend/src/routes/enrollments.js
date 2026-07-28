const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, enrollmentController.registerCourse);
router.delete('/:courseId', authenticate, enrollmentController.dropCourse);

module.exports = router;
