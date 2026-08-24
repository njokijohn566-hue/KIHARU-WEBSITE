const express = require('express');
const router = express.Router();
const feesController = require('../controllers/feesController');
const { authenticate, authorize } = require('../middleware/auth');

// Admin routes
router.get(
  '/admin',
  authenticate,
  authorize(['admin']),
  feesController.getAdminFees
);

// Student routes
router.get('/', authenticate, feesController.getFeeInfo);
router.get('/invoice/:semester', authenticate, feesController.getSemesterInvoice);
router.get('/invoice/:semester/download', authenticate, feesController.downloadInvoice);

module.exports = router;