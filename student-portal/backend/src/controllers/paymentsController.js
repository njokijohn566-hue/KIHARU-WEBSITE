const Payment = require('../models/Payment');
const Fee = require('../models/Fee');
const Student = require('../models/Student');

exports.initiatePayment = async (req, res) => {
  try {
    const { feeId, amount, paymentMethod } = req.body;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify fee belongs to student
    const fee = await Fee.findById(feeId);
    if (!fee || fee.student_id !== student.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Validate amount
    if (amount <= 0 || amount > fee.outstanding_balance) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    // Create payment record
    const payment = await Payment.create(student.id, feeId, amount, paymentMethod);

    // Mock payment processing (in production, integrate with actual payment gateway)
    // This would normally redirect to Stripe/M-Pesa, etc.

    res.status(201).json({
      success: true,
      message: 'Payment initiated',
      data: {
        paymentId: payment.id,
        amount: payment.amount,
        method: payment.payment_method,
        referenceNumber: payment.reference_number,
        status: payment.status,
        // In production, return payment gateway redirect URL
        redirectUrl: null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment || payment.student_id !== student.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Update payment status
    const updated = await Payment.updateStatus(paymentId, 'completed', transactionId);

    // Update fee status
    const fee = await Fee.findById(payment.fee_id);
    const newPaidAmount = fee.paid_amount + payment.amount;
    await Fee.update(payment.fee_id, newPaidAmount);

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentId: updated.id,
        status: updated.status,
        transactionId: updated.transaction_id,
        paymentDate: updated.payment_date
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const payments = await Payment.getPaymentHistory(student.id);

    res.json({
      success: true,
      data: {
        payments,
        count: payments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
};

exports.downloadReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment || payment.student_id !== student.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Receipt PDF generation initiated',
      data: {
        paymentId: payment.id,
        referenceNumber: payment.reference_number
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate receipt',
      error: error.message
    });
  }
};
