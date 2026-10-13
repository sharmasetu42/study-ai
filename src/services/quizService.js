// ============================================================
//  src/services/quizService.js
//  Submit quiz results and fetch quiz history.
// ============================================================

import api from './api';

// ── Submit a completed quiz ───────────────────────────────────
export const submitQuiz = async ({ subject, answers, timeTaken }) => {
  const { data } = await api.post('/quiz/submit', { subject, answers, timeTaken });
  return data.data;
};

// ── Get all past quiz attempts ────────────────────────────────
export const getQuizHistory = async () => {
  const { data } = await api.get('/quiz/history');
  return data.data;
};
