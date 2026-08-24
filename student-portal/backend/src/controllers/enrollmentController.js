const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Student = require('../models/Student');

const MAX_CREDITS_PER_SEMESTER = 24;

exports.registerCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if already enrolled
    const existing = await Enrollment.findByCourseAndStudent(courseId, student.id);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check credit limit
    const totalCredits = await Enrollment.getStudentCreditCount(student.id, course.semester);
    if ((totalCredits || 0) + course.credits > MAX_CREDITS_PER_SEMESTER) {
      return res.status(400).json({
        success: false,
        message: `Exceeds maximum credits (${MAX_CREDITS_PER_SEMESTER}) per semester`,
        currentCredits: totalCredits
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create(student.id, courseId);

    res.status(201).json({
      success: true,
      message: 'Course registered successfully',
      data: {
        enrollment,
        course: {
          id: course.id,
          courseCode: course.course_code,
          courseName: course.course_name,
          credits: course.credits
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to register course',
      error: error.message
    });
  }
};

exports.dropCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if enrolled
    const enrollment = await Enrollment.findByCourseAndStudent(courseId, student.id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Drop course
    const dropped = await Enrollment.drop(courseId, student.id);

    res.json({
      success: true,
      message: 'Course dropped successfully',
      data: dropped
    });
   } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to drop course',
      error: error.message
    });
  }
};

exports.getAdminEnrollments = async (req, res) => {
  try {
    const result = await require('../utils/db').query(`
      SELECT
        e.id,
        e.registration_number,
        e.enrollment_date,
        e.status,

        s.id AS student_record_id,
        s.student_id,

        u.first_name,
        u.last_name,
        u.email,

        c.id AS course_id,
        c.course_code,
        c.course_name,
        c.credits,
        c.semester,
        c.academic_year

      FROM enrollments e

      JOIN students s
        ON e.student_id = s.id

      JOIN users u
        ON s.user_id = u.id

      JOIN courses c
        ON e.course_id = c.id

      ORDER BY e.enrollment_date DESC
    `);

    res.json({
      success: true,
      data: {
        enrollments: result.rows,
        count: result.rows.length
      }
    });

  } catch (error) {
    console.error('Failed to fetch admin enrollments:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
};
