const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, paymentsController.initiatePayment);
router.post('/confirm', authenticate, paymentsController.confirmPayment);
router.get('/history', authenticate, paymentsController.getPaymentHistory);
router.get('/:paymentId/receipt', authenticate, paymentsController.downloadReceipt);

module.exports = router;
