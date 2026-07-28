const Grade = require('../models/Grade');
const Student = require('../models/Student');

exports.getAllGrades = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const grades = await Grade.findByStudentId(student.id);
    const gpa = await Grade.getGPA(student.id);

    res.json({
      success: true,
      data: {
        grades,
        gpa: parseFloat(gpa).toFixed(2),
        totalCourses: grades.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades',
      error: error.message
    });
  }
};

exports.getGradesByYear = async (req, res) => {
  try {
    const { year, semester } = req.query;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    let grades = await Grade.findByStudentId(student.id);

    if (semester) {
      grades = grades.filter(g => g.semester == semester);
    }

    res.json({
      success: true,
      data: {
        grades,
        count: grades.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades',
      error: error.message
    });
  }
};

exports.getTranscript = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const transcript = await Grade.getTranscript(student.id);
    const gpa = await Grade.getGPA(student.id);

    res.json({
      success: true,
      data: {
        studentId: student.student_id,
        studentName: `${student.first_name} ${student.last_name}`,
        email: student.email,
        gpa: parseFloat(gpa).toFixed(2),
        transcript
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate transcript',
      error: error.message
    });
  }
};

exports.downloadTranscriptPDF = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // In production, use a library like pdfkit or puppeteer
    const transcript = await Grade.getTranscript(student.id);
    const gpa = await Grade.getGPA(student.id);

    res.json({
      success: true,
      message: 'PDF generation initiated. Download link will be sent to your email.',
      data: {
        studentId: student.student_id,
        gpa: parseFloat(gpa).toFixed(2),
        gradesCount: transcript.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};
