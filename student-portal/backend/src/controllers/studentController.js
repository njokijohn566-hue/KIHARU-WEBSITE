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

    const updated = await Student.update(student.id, phone, address, city, country);

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
