// ============================================================
//  routes/progress.js
//  Aggregates quiz history + document stats into progress data.
// ============================================================

const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');
const Quiz     = require('../models/Quiz');
const Document = require('../models/Document');

// ── GET /api/progress ────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  const userId = req.user._id;

  // Run all DB queries in parallel for speed
  const [quizzes, documents] = await Promise.all([
    Quiz.find({ user: userId }),
    Document.find({ user: userId }),
  ]);

  // Calculate stats
  const totalQuizzes    = quizzes.length;
  const avgScore        = totalQuizzes
    ? Math.round(quizzes.reduce((s, q) => s + q.score, 0) / totalQuizzes)
    : 0;
  const totalCorrect    = quizzes.reduce((s, q) => s + q.correct, 0);
  const totalQuestions  = quizzes.reduce((s, q) => s + q.totalQ, 0);
  const totalDocuments  = documents.length;

  // Per-subject scores (group quizzes by subject)
  const subjectMap = {};
  quizzes.forEach((q) => {
    if (!subjectMap[q.subject]) subjectMap[q.subject] = { total: 0, count: 0 };
    subjectMap[q.subject].total += q.score;
    subjectMap[q.subject].count += 1;
  });
  const subjectProgress = Object.entries(subjectMap).map(([subject, data]) => ({
    subject,
    percent: Math.round(data.total / data.count),
  }));

  // Recent activity (last 10 quizzes as activity items)
  const recentActivity = quizzes
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10)
    .map((q) => ({
      type:   'quiz',
      title:  'Quiz completed',
      detail: `${q.subject}  •  Score: ${q.correct}/${q.totalQ}`,
      time:   q.createdAt,
    }));

  res.status(200).json({
    success: true,
    data: {
      overallPercent:    avgScore,
      topicsCompleted:   totalDocuments,
      quizzesCompleted:  totalQuizzes,
      questionsAnswered: totalQuestions,
      totalDocuments,
      avgScore,
      subjectProgress,
      recentActivity,
    },
  });
});

module.exports = router;
