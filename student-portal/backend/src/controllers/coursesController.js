const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');

exports.getAvailableCourses = async (req, res) => {
  try {
    const { semester } = req.query;
    let courses;

    if (semester) {
      courses = await Course.getBySemester(parseInt(semester));
    } else {
      courses = await Course.findAll();
    }

    res.json({
      success: true,
      data: {
        courses,
        count: courses.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const enrollments = await Enrollment.findByStudentId(student.id);

    res.json({
      success: true,
      data: {
        enrollments,
        count: enrollments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses',
      error: error.message
    });
  }
};
