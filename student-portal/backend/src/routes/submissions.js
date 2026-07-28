const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, submissionController.submitAssignment);
router.get('/', authenticate, submissionController.getSubmissions);
router.get('/:submissionId', authenticate, submissionController.getSubmissionDetails);

module.exports = router;
