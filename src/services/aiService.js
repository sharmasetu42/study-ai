// ============================================================
//  src/services/aiService.js
//  Sends messages to the AI Tutor backend endpoint.
// ============================================================

import api from './api';

// ── Send a chat message to Gemini ────────────────────────────
// history = array of { role: 'user'|'ai', text: string }
export const sendChatMessage = async ({ message, documentId, history }) => {
  const { data } = await api.post('/ai/chat', {
    message,
    documentId: documentId || null,
    history:    history    || [],
  });
  return data.data; // { reply, role }
};

// ── Generate quiz questions from a document ──────────────────
export const generateQuizFromDoc = async ({ documentId, count = 5 }) => {
  const { data } = await api.post('/ai/generate-quiz', { documentId, count });
  return data.data; // array of question objects
};

// ── Summarize a document ─────────────────────────────────────
export const summarizeDocument = async (documentId) => {
  const { data } = await api.post('/ai/summarize', { documentId });
  return data.data.summary;
};
