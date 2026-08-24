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

exports.getAdminGrades = async (req, res) => {
  try {
    const pool = require('../utils/db');

    const result = await pool.query(`
      SELECT
        g.id,
        g.enrollment_id,
        g.student_id,
        g.course_id,
        g.cat_mark,
        g.exam_mark,
        g.final_grade,
        g.letter_grade,
        g.gpa_points,
        g.remarks,
        g.published,
        g.created_at,
        g.updated_at,

        s.student_id AS student_number,

        u.first_name,
        u.last_name,
        u.email,

        c.course_code,
        c.course_name,
        c.credits,
        c.semester,
        c.academic_year

      FROM grades g

      JOIN students s
        ON g.student_id = s.id

      JOIN users u
        ON s.user_id = u.id

      JOIN courses c
        ON g.course_id = c.id

      ORDER BY
        u.last_name,
        u.first_name,
        c.course_code
    `);

    res.json({
      success: true,
      data: {
        grades: result.rows,
        count: result.rows.length
      }
    });

  } catch (error) {
    console.error('Failed to fetch admin grades:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades',
      error: error.message
    });
  }
};