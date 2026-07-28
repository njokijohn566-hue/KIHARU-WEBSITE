const pool = require('../utils/db');

const Course = {
  findAll: async (semester = null, limit = 100) => {
    let query = 'SELECT * FROM courses WHERE true';
    const params = [];
    
    if (semester) {
      query += ' AND semester = $1';
      params.push(semester);
    }
    
    query += ' LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  findByCode: async (courseCode) => {
    const result = await pool.query(
      'SELECT * FROM courses WHERE course_code = $1',
      [courseCode]
    );
    return result.rows[0];
  },

  create: async (courseCode, courseName, description, credits, semester) => {
    const result = await pool.query(
      'INSERT INTO courses (course_code, course_name, description, credits, semester) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [courseCode, courseName, description, credits, semester]
    );
    return result.rows[0];
  },

  getBySemester: async (semester) => {
    const result = await pool.query(
      'SELECT * FROM courses WHERE semester = $1 ORDER BY course_code',
      [semester]
    );
    return result.rows;
  }
};

module.exports = Course;
