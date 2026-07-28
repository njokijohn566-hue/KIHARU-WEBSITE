require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./src/routes/auth');
const studentRoutes = require('./src/routes/students');
const gradesRoutes = require('./src/routes/grades');
const coursesRoutes = require('./src/routes/courses');
const enrollmentRoutes = require('./src/routes/enrollments');
const feesRoutes = require('./src/routes/fees');
const paymentsRoutes = require('./src/routes/payments');
const assignmentRoutes = require('./src/routes/assignments');
const submissionRoutes = require('./src/routes/submissions');

// Import middleware
const { errorHandler } = require('./src/middleware/errorHandler');
const { requestLogger } = require('./src/middleware/logger');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(requestLogger);

// Upload directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
const apiPrefix = '/api';

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/students`, studentRoutes);
app.use(`${apiPrefix}/grades`, gradesRoutes);
app.use(`${apiPrefix}/courses`, coursesRoutes);
app.use(`${apiPrefix}/enrollments`, enrollmentRoutes);
app.use(`${apiPrefix}/fees`, feesRoutes);
app.use(`${apiPrefix}/payments`, paymentsRoutes);
app.use(`${apiPrefix}/assignments`, assignmentRoutes);
app.use(`${apiPrefix}/submissions`, submissionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Student Portal Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL}\n`);
});

module.exports = app;
