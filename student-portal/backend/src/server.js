require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const gradesRoutes = require('./routes/grades');
const coursesRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const feesRoutes = require('./routes/fees');
const paymentsRoutes = require('./routes/payments');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const aiRoutes = require('./routes/ai');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

const app = express();

// Middleware
// Configure CORS: allow explicit client origin(s) and common localhost dev origins.
const allowedOrigins = [];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);
if (process.env.LOCAL_CLIENT_URL) allowedOrigins.push(process.env.LOCAL_CLIENT_URL);
allowedOrigins.push(
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.0.104:3000',

  'http://localhost:5173',
  'http://127.0.0.1:5173',

  'http://localhost:5500',
  'http://127.0.0.1:5500',

  'http://localhost:8080',
  'http://127.0.0.1:8080'
);
// Allow the public Kiharu website origins (update via env if different in production)
allowedOrigins.push('https://kiharutvc.ac.ke', 'https://www.kiharutvc.ac.ke');

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Reduce global JSON body size to a reasonable limit for chat messages.
// Route-specific endpoints that need larger payloads should opt into larger limits.
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ limit: '50kb', extended: true }));
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
app.use(`${apiPrefix}/ai`, aiRoutes);

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
