const pool = require('../utils/db');

const Payment = {
  findByStudent: async (studentId) => {
    const result = await pool.query(
      'SELECT * FROM payments WHERE student_id = $1 ORDER BY payment_date DESC',
      [studentId]
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM payments WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  create: async (studentId, feeId, amount, paymentMethod) => {
    const result = await pool.query(
      'INSERT INTO payments (student_id, fee_id, amount, payment_method, reference_number, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [studentId, feeId, amount, paymentMethod, `PAY-${Date.now()}`, 'pending']
    );
    return result.rows[0];
  },

  updateStatus: async (id, status, transactionId = null) => {
    const paymentDate = status === 'completed' ? new Date() : null;
    const result = await pool.query(
      'UPDATE payments SET status = $1, transaction_id = $2, payment_date = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [status, transactionId, paymentDate, id]
    );
    return result.rows[0];
  },

  getPaymentHistory: async (studentId, limit = 50) => {
    const result = await pool.query(
      'SELECT * FROM payments WHERE student_id = $1 AND status = $2 ORDER BY payment_date DESC LIMIT $3',
      [studentId, 'completed', limit]
    );
    return result.rows;
  }
};

module.exports = Payment;
