const pool = require('../utils/db');

const User = {
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  create: async (email, passwordHash, firstName, lastName) => {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, passwordHash, firstName, lastName, 'student']
    );
    return result.rows[0];
  },

  update: async (id, firstName, lastName) => {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [firstName, lastName, id]
    );
    return result.rows[0];
  }
};

module.exports = User;
