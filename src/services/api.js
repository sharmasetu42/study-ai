// ============================================================
//  src/services/api.js
//  Central Axios instance used by every service file.
//  - Reads the base URL from Vite env variable
//  - Automatically attaches JWT from localStorage to every request
//  - Handles 401 (expired token) by redirecting to /login
// ============================================================

import axios from 'axios';

// Base URL: set VITE_API_URL in .env.local, otherwise fall back to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 seconds
});

// ── Request interceptor: attach JWT token ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studyai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle auth errors globally ────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and go to login
      localStorage.removeItem('studyai_token');
      localStorage.removeItem('studyai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
