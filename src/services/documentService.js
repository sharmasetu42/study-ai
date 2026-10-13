// ============================================================
//  src/services/documentService.js
//  CRUD + upload for study documents.
// ============================================================

import api from './api';

// ── Get all documents for the logged-in user ─────────────────
export const getDocuments = async () => {
  const { data } = await api.get('/documents');
  return data.data; // array of document objects
};

// ── Upload a PDF file ────────────────────────────────────────
// Uses multipart/form-data — different Content-Type than JSON
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const { data } = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

// ── Delete a document ────────────────────────────────────────
export const deleteDocument = async (id) => {
  const { data } = await api.delete(`/documents/${id}`);
  return data;
};

// ── Get a single document ────────────────────────────────────
export const getDocument = async (id) => {
  const { data } = await api.get(`/documents/${id}`);
  return data.data;
};
