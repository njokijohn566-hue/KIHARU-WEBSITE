const pool = require('../utils/db');

const Grade = {
  findByStudentId: async (studentId) => {
    const result = await pool.query(
      `SELECT g.*, c.course_code, c.course_name, c.credits
       FROM grades g
       JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = $1 AND g.published = true
       ORDER BY c.course_code`,
      [studentId]
    );
    return result.rows;
  },

  findByCourse: async (studentId, courseId) => {
    const result = await pool.query(
      'SELECT * FROM grades WHERE student_id = $1 AND course_id = $2',
      [studentId, courseId]
    );
    return result.rows[0];
  },

  create: async (enrollmentId, studentId, courseId, catMark, examMark) => {
    const finalGrade = (catMark * 0.3) + (examMark * 0.7);
    const letterGrade = finalGrade >= 70 ? 'A' : finalGrade >= 60 ? 'B' : finalGrade >= 50 ? 'C' : 'D';
    const gpaPoints = letterGrade === 'A' ? 4 : letterGrade === 'B' ? 3 : letterGrade === 'C' ? 2 : 1;

    const result = await pool.query(
      `INSERT INTO grades (enrollment_id, student_id, course_id, cat_mark, exam_mark, final_grade, letter_grade, gpa_points)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [enrollmentId, studentId, courseId, catMark, examMark, finalGrade, letterGrade, gpaPoints]
    );
    return result.rows[0];
  },

  getTranscript: async (studentId) => {
    const result = await pool.query(
      `SELECT g.*, c.course_code, c.course_name, c.credits
       FROM grades g
       JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = $1 AND g.published = true
       ORDER BY c.semester DESC, c.course_code`,
      [studentId]
    );
    return result.rows;
  },

  getGPA: async (studentId) => {
    const result = await pool.query(
      `SELECT AVG(gpa_points) as gpa FROM grades WHERE student_id = $1 AND published = true`,
      [studentId]
    );
    return result.rows[0].gpa || 0;
  }
};

module.exports = Grade;
