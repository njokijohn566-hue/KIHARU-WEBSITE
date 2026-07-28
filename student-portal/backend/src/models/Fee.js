const pool = require('../utils/db');

const Fee = {
  findByStudent: async (studentId) => {
    const result = await pool.query(
      'SELECT * FROM fees WHERE student_id = $1 ORDER BY semester DESC',
      [studentId]
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM fees WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  create: async (studentId, semester, academicYear, totalAmount) => {
    const result = await pool.query(
      'INSERT INTO fees (student_id, semester, academic_year, total_amount, outstanding_balance, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [studentId, semester, academicYear, totalAmount, totalAmount, 'pending']
    );
    return result.rows[0];
  },

  update: async (id, paidAmount) => {
    const fee = await Fee.findById(id);
    const outstanding = fee.total_amount - paidAmount;
    const status = outstanding <= 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'pending';

    const result = await pool.query(
      'UPDATE fees SET paid_amount = $1, outstanding_balance = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [paidAmount, outstanding, status, id]
    );
    return result.rows[0];
  },

  getBalance: async (studentId) => {
    const result = await pool.query(
      'SELECT SUM(outstanding_balance) as total_balance FROM fees WHERE student_id = $1 AND status != $2',
      [studentId, 'paid']
    );
    return result.rows[0].total_balance || 0;
  }
};

module.exports = Fee;
