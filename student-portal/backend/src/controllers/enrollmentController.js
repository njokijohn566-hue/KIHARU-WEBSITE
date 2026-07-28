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
