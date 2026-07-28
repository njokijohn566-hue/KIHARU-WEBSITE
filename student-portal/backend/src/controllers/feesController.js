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
