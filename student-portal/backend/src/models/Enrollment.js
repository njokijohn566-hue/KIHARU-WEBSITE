const pool = require('../utils/db');

const Enrollment = {
  findByStudentId: async (studentId) => {
    const result = await pool.query(
      `SELECT e.*, c.course_code, c.course_name, c.credits
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = $1 AND e.status = 'active'
       ORDER BY c.course_code`,
      [studentId]
    );
    return result.rows;
  },

  findByCourseAndStudent: async (courseId, studentId) => {
    const result = await pool.query(
      'SELECT * FROM enrollments WHERE course_id = $1 AND student_id = $2',
      [courseId, studentId]
    );
    return result.rows[0];
  },

  create: async (studentId, courseId) => {
    const result = await pool.query(
      'INSERT INTO enrollments (student_id, course_id, registration_number) VALUES ($1, $2, $3) RETURNING *',
      [studentId, courseId, `REG-${Date.now()}`]
    );
    return result.rows[0];
  },

  drop: async (courseId, studentId) => {
    const result = await pool.query(
      "UPDATE enrollments SET status = 'dropped', updated_at = CURRENT_TIMESTAMP WHERE course_id = $1 AND student_id = $2 RETURNING *",
      [courseId, studentId]
    );
    return result.rows[0];
  },

  getStudentCreditCount: async (studentId, semester) => {
    const result = await pool.query(
      `SELECT SUM(c.credits) as total_credits
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = $1 AND c.semester = $2 AND e.status = 'active'`,
      [studentId, semester]
    );
    return result.rows[0].total_credits || 0;
  }
};

module.exports = Enrollment;
