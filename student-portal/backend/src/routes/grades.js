const express = require('express');
const router = express.Router();

const gradesController = require('../controllers/gradesController');
const { authenticate, authorize } = require('../middleware/auth');

// Admin routes
router.get(
  '/admin',
  authenticate,
  authorize(['admin']),
  gradesController.getAdminGrades
);

// Student routes
router.get('/', authenticate, gradesController.getAllGrades);
router.get('/by-year', authenticate, gradesController.getGradesByYear);
router.get('/transcript', authenticate, gradesController.getTranscript);
router.get(
  '/transcript/download',
  authenticate,
  gradesController.downloadTranscriptPDF
);

module.exports = router;