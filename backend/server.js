// ============================================================
//  server.js  –  StudyAI Express Backend
//  Entry point: loads env, connects DB, mounts all routes.
// ============================================================

// Load environment variables first (before anything else)
require('dotenv').config();

// Enables async error handling without try/catch in every controller
require('express-async-errors');

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const connectDB = require('./config/db');

// ── Import route files ───────────────────────────────────────
const authRoutes     = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const quizRoutes     = require('./routes/quiz');
const aiRoutes       = require('./routes/ai');
const progressRoutes = require('./routes/progress');

// ── Connect to MongoDB ───────────────────────────────────────
connectDB();

// ── Create Express app ───────────────────────────────────────
const app = express();

// ── Middleware ───────────────────────────────────────────────

// CORS: allow requests from the React frontend
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
// e.g. GET /uploads/filename.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ StudyAI API is running',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/quiz',      quizRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/progress',  progressRoutes);

// ── Global error handler ─────────────────────────────────────
// This catches any error thrown inside async route handlers
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);

  // Mongoose duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'This email is already registered',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10 MB.',
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ── Start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 StudyAI backend running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
