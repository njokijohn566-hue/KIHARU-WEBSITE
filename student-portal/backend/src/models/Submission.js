const pool = require('../utils/db');

const Submission = {
  findByStudent: async (studentId) => {
    const result = await pool.query(
      `SELECT s.*, a.title, a.due_date, a.max_score
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE s.student_id = $1
       ORDER BY s.submission_date DESC`,
      [studentId]
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  findByAssignmentAndStudent: async (assignmentId, studentId) => {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE assignment_id = $1 AND student_id = $2',
      [assignmentId, studentId]
    );
    return result.rows[0];
  },

  create: async (assignmentId, studentId, fileUrl) => {
    const result = await pool.query(
      'INSERT INTO submissions (assignment_id, student_id, file_url, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [assignmentId, studentId, fileUrl, 'submitted']
    );
    return result.rows[0];
  },

  updateScore: async (id, score, feedback, markedBy) => {
    const result = await pool.query(
      'UPDATE submissions SET score = $1, feedback = $2, marked_by = $3, marked_at = CURRENT_TIMESTAMP, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [score, feedback, markedBy, 'graded', id]
    );
    return result.rows[0];
  }
};

module.exports = Submission;
