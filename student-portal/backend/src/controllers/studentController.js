const Student = require('../models/Student');

exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

exports.getProfileWithStats = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const profile = await Student.getProfileWithStats(student.id);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile stats',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { phone, address, city, country } = req.body;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const updated = await Student.update(
      student.id,
      phone,
      address,
      city,
      country
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();

    res.json({
      success: true,
      data: {
        students,
        count: students.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
};

exports.updateStudentByAdmin = async (req, res) => {
  try {
    const { studentId } = req.params;

    const {
      firstName,
      lastName,
      email,
      studentIdNumber,
      dateOfBirth,
      phone,
      address,
      city,
      country,
      currentSemester
    } = req.body;

    if (!firstName || !lastName || !email || !studentIdNumber) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email and student ID are required'
      });
    }

    const updatedStudent = await Student.adminUpdate(
      studentId,
      firstName,
      lastName,
      email,
      studentIdNumber,
      dateOfBirth || null,
      phone || null,
      address || null,
      city || null,
      country || null,
      currentSemester || 1
    );

    const student = await Student.findById(studentId);

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Admin student update error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};


exports.updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be true or false'
      });
    }

    const result = await Student.setActiveStatus(
      studentId,
      isActive
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: isActive
        ? 'Student activated successfully'
        : 'Student deactivated successfully',
      data: result
    });

  } catch (error) {
    console.error('Student status update error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update student status',
      error: error.message
    });
  }
};