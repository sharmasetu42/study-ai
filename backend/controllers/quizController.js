// ============================================================
//  controllers/quizController.js
//  Submit a completed quiz attempt and fetch quiz history.
// ============================================================

const Quiz = require('../models/Quiz');

// ── POST /api/quiz/submit ────────────────────────────────────
const submitQuiz = async (req, res) => {
  const { subject, answers, timeTaken } = req.body;

  if (!answers || answers.length === 0) {
    return res.status(400).json({ success: false, message: 'No answers provided' });
  }

  const totalQ   = answers.length;
  const correct  = answers.filter((a) => a.correct).length;
  const score    = Math.round((correct / totalQ) * 100);

  const quiz = await Quiz.create({
    user:      req.user._id,
    subject:   subject || 'General',
    totalQ,
    correct,
    score,
    answers,
    timeTaken: timeTaken || 0,
  });

  res.status(201).json({
    success: true,
    data: {
      id:      quiz._id,
      subject: quiz.subject,
      score,
      correct,
      totalQ,
      createdAt: quiz.createdAt,
    },
  });
};

// ── GET /api/quiz/history ────────────────────────────────────
const getQuizHistory = async (req, res) => {
  const quizzes = await Quiz.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('-answers'); // don't send full answers in list

  res.status(200).json({ success: true, data: quizzes });
};

// ── GET /api/quiz/:id ────────────────────────────────────────
const getQuizById = async (req, res) => {
  const quiz = await Quiz.findOne({
    _id:  req.params.id,
    user: req.user._id,
  });

  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }

  res.status(200).json({ success: true, data: quiz });
};

module.exports = { submitQuiz, getQuizHistory, getQuizById };
