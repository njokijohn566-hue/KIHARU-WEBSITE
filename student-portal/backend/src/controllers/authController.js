const bcrypt = require('bcrypt');
const User = require('../models/User');
const Student = require('../models/Student');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, studentId } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create(email, passwordHash, firstName, lastName);

    // Create student record
    const student = await Student.create(user.id, studentId, dateOfBirth, '', '', '', '');

    const token = generateToken(user.id, user.email, 'student');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        userId: user.id,
        studentId: student.id,
        email: user.email,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const student = await Student.findByUserId(user.id);
    const token = generateToken(user.id, user.email, 'student');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        studentId: student.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token required'
      });
    }

    const user = await User.findById(req.user.userId);
    const newToken = generateToken(user.id, user.email, 'student');

    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message
    });
  }
};
