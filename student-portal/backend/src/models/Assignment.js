const pool = require('../utils/db');

const Assignment = {
  findByCourse: async (courseId) => {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE course_id = $1 ORDER BY due_date DESC',
      [courseId]
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  findByStudent: async (studentId) => {
    const result = await pool.query(
      `SELECT a.*, c.course_code, c.course_name
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       JOIN enrollments e ON e.course_id = c.id AND e.student_id = $1
       WHERE e.status = 'active'
       ORDER BY a.due_date DESC`,
      [studentId]
    );
    return result.rows;
  },

  create: async (courseId, title, description, dueDate, maxScore = 10) => {
    const result = await pool.query(
      'INSERT INTO assignments (course_id, title, description, due_date, max_score, released_date) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *',
      [courseId, title, description, dueDate, maxScore]
    );
    return result.rows[0];
  }
};

module.exports = Assignment;
