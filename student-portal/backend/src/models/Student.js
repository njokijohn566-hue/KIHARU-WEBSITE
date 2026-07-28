const pool = require('../utils/db');

const Student = {
  findByUserId: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM students WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT s.*, u.email, u.first_name, u.last_name FROM students s JOIN users u ON s.user_id = u.id WHERE s.id = $1',
      [id]
    );
    return result.rows[0];
  },

  create: async (userId, studentId, dateOfBirth, phone, address, city, country) => {
    const result = await pool.query(
      'INSERT INTO students (user_id, student_id, date_of_birth, phone, address, city, country, enrollment_date, current_semester) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, 1) RETURNING *',
      [userId, studentId, dateOfBirth, phone, address, city, country]
    );
    return result.rows[0];
  },

  update: async (id, phone, address, city, country) => {
    const result = await pool.query(
      'UPDATE students SET phone = $1, address = $2, city = $3, country = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [phone, address, city, country, id]
    );
    return result.rows[0];
  },

  getProfileWithStats: async (studentId) => {
    const result = await pool.query(
      `SELECT s.*, u.email, u.first_name, u.last_name,
        (SELECT COUNT(*) FROM enrollments WHERE student_id = s.id AND status = 'active') as enrolled_courses,
        (SELECT COUNT(*) FROM submissions WHERE student_id = s.id) as submissions_count,
        (SELECT SUM(exam_mark) / COUNT(*) FROM grades WHERE student_id = s.id) as avg_exam_mark
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [studentId]
    );
    return result.rows[0];
  }
};

module.exports = Student;
