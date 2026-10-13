// ============================================================
//  src/services/authService.js
//  All authentication API calls: register, login, getMe.
// ============================================================

import api from './api';

// ── Register a new user ──────────────────────────────────────
export const registerUser = async ({ fullName, email, password }) => {
  const { data } = await api.post('/auth/register', { fullName, email, password });
  // Save token and user to localStorage for persistence
  localStorage.setItem('studyai_token', data.token);
  localStorage.setItem('studyai_user',  JSON.stringify(data.user));
  return data;
};

// ── Login ────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('studyai_token', data.token);
  localStorage.setItem('studyai_user',  JSON.stringify(data.user));
  return data;
};

// ── Get current user profile ─────────────────────────────────
export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

// ── Logout (client-side only) ────────────────────────────────
export const logoutUser = () => {
  localStorage.removeItem('studyai_token');
  localStorage.removeItem('studyai_user');
};

// ── Read saved user from localStorage (no API call) ──────────
export const getSavedUser = () => {
  try {
    const user = localStorage.getItem('studyai_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!localStorage.getItem('studyai_token');
