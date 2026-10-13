// ============================================================
//  routes/quiz.js
// ============================================================

const express = require('express');
const router  = express.Router();
const { submitQuiz, getQuizHistory, getQuizById } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.post('/submit',    protect, submitQuiz);
router.get('/history',    protect, getQuizHistory);
router.get('/:id',        protect, getQuizById);

module.exports = router;
