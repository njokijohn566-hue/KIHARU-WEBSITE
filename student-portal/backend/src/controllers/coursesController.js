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

exports.createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      description,
      credits,
      semester,
      academicYear,
      capacity
    } = req.body;

    if (!courseCode || !courseName || !credits || !semester || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Course code, course name, credits, semester and academic year are required'
      });
    }

    const existingCourse = await Course.findByCode(courseCode);

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: 'Course code already exists'
      });
    }

    const course = await Course.create(
      courseCode,
      courseName,
      description || '',
      parseInt(credits),
      parseInt(semester),
      academicYear,
      capacity ? parseInt(capacity) : null
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};
exports.getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();

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
      message: 'Failed to fetch admin courses',
      error: error.message
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      courseCode,
      courseName,
      description,
      credits,
      semester,
      academicYear,
      capacity
    } = req.body;

    if (!courseCode || !courseName || !credits || !semester || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Course code, course name, credits, semester and academic year are required'
      });
    }

    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const courseWithSameCode = await Course.findByCode(courseCode);

    if (courseWithSameCode && courseWithSameCode.id !== parseInt(courseId)) {
      return res.status(409).json({
        success: false,
        message: 'Course code already exists'
      });
    }

    const updatedCourse = await Course.update(
      parseInt(courseId),
      courseCode,
      courseName,
      description || '',
      parseInt(credits),
      parseInt(semester),
      academicYear,
      capacity ? parseInt(capacity) : null
    );

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollments = await Enrollment.findByCourseId(courseId);

    if (enrollments.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete a course that has student enrollments',
        enrollmentCount: enrollments.length
      });
    }

    const deletedCourse = await Course.delete(parseInt(courseId));

    res.json({
      success: true,
      message: 'Course deleted successfully',
      data: deletedCourse
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};