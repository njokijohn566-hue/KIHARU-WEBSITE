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

  adminUpdate: async (
    id,
    firstName,
    lastName,
    email,
    studentId,
    dateOfBirth,
    phone,
    address,
    city,
    country,
    currentSemester
  ) => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const studentResult = await client.query(
        `SELECT user_id
         FROM students
         WHERE id = $1`,
        [id]
      );

      if (studentResult.rows.length === 0) {
        throw new Error('Student not found');
      }

      const userId = studentResult.rows[0].user_id;

      await client.query(
        `UPDATE users
         SET first_name = $1,
             last_name = $2,
             email = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [firstName, lastName, email, userId]
      );

      const studentUpdate = await client.query(
        `UPDATE students
         SET student_id = $1,
             date_of_birth = $2,
             phone = $3,
             address = $4,
             city = $5,
             country = $6,
             current_semester = $7,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [
          studentId,
          dateOfBirth,
          phone,
          address,
          city,
          country,
          currentSemester,
          id
        ]
      );

      await client.query('COMMIT');

      return studentUpdate.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  setActiveStatus: async (id, isActive) => {
    const result = await pool.query(
      `UPDATE users
       SET is_active = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = (
         SELECT user_id
         FROM students
         WHERE id = $2
       )
       RETURNING id, is_active`,
      [isActive, id]
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
  },

    findAll: async () => {
    const result = await pool.query(
      `SELECT
        s.id,
        s.student_id,
        s.date_of_birth,
        s.phone,
        s.address,
        s.city,
        s.country,
        s.enrollment_date,
        s.current_semester,
        u.id AS user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.is_active
       FROM students s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.id`
    );

    return result.rows;
  },
};

module.exports = Student;
