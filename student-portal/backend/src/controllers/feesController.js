const Fee = require('../models/Fee');
const Student = require('../models/Student');

exports.getFeeInfo = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const fees = await Fee.findByStudent(student.id);
    const totalBalance = await Fee.getBalance(student.id);

    res.json({
      success: true,
      data: {
        fees,
        totalBalance,
        feeCount: fees.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fee information',
      error: error.message
    });
  }
};

exports.getSemesterInvoice = async (req, res) => {
  try {
    const { semester } = req.params;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const fees = await Fee.findByStudent(student.id);
    const invoice = fees.find(f => f.semester == semester);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found for this semester'
      });
    }

    res.json({
      success: true,
      data: {
        invoiceId: invoice.id,
        studentId: student.student_id,
        studentName: `${student.first_name} ${student.last_name}`,
        semester: invoice.semester,
        academicYear: invoice.academic_year,
        totalAmount: invoice.total_amount,
        paidAmount: invoice.paid_amount,
        outstandingBalance: invoice.outstanding_balance,
        status: invoice.status,
        issueDate: invoice.created_at,
        dueDate: invoice.due_date
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const { semester } = req.params;
    const student = await Student.findByUserId(req.user.userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice PDF generation initiated',
      data: {
        studentId: student.student_id,
        semester
      }
    });
    } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice',
      error: error.message
    });
  }
};

exports.getAdminFees = async (req, res) => {
  try {
    const pool = require('../utils/db');

    const result = await pool.query(`
      SELECT
        f.id,
        f.student_id,
        f.semester,
        f.academic_year,
        f.total_amount,
        f.paid_amount,
        f.outstanding_balance,
        f.due_date,
        f.status,
        f.created_at,
        f.updated_at,

        s.student_id AS student_number,

        u.first_name,
        u.last_name,
        u.email

      FROM fees f

      JOIN students s
        ON f.student_id = s.id

      JOIN users u
        ON s.user_id = u.id

      ORDER BY
        u.last_name,
        u.first_name,
        f.academic_year DESC,
        f.semester DESC
    `);

    res.json({
      success: true,
      data: {
        fees: result.rows,
        count: result.rows.length
      }
    });

  } catch (error) {
    console.error('Failed to fetch admin fees:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch fees',
      error: error.message
    });
  }
};