const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, assignmentController.getAllAssignments);
router.get('/:assignmentId', authenticate, assignmentController.getAssignmentDetails);
router.get('/course/:courseId', authenticate, assignmentController.getCourseAssignments);

module.exports = router;
