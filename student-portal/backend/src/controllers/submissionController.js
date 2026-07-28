const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, fileUrl } = req.body;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if already submitted
    const existing = await Submission.findByAssignmentAndStudent(assignmentId, student.id);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Already submitted this assignment',
        submission: existing
      });
    }

    // Check deadline
    const now = new Date();
    const isLate = now > new Date(assignment.due_date);

    // Create submission
    const submission = await Submission.create(assignmentId, student.id, fileUrl);

    res.status(201).json({
      success: true,
      message: isLate ? 'Assignment submitted (LATE)' : 'Assignment submitted successfully',
      data: {
        submissionId: submission.id,
        status: submission.status,
        isLate,
        submissionDate: submission.submission_date,
        dueDate: assignment.due_date
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit assignment',
      error: error.message
    });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const submissions = await Submission.findByStudent(student.id);

    res.json({
      success: true,
      data: {
        submissions,
        count: submissions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
};

exports.getSubmissionDetails = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission || submission.student_id !== student.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message
    });
  }
};
