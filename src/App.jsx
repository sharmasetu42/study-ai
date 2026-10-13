// ============================================================
//  App.jsx
//  Root component — React Router + AuthProvider.
//
//  Route structure:
//    /               → redirect to /login
//    /login          → Login page  (public)
//    /register       → Register page (public)
//    /dashboard      → Dashboard   ┐
//    /ai-tutor       → AI Tutor    │  All wrapped in
//    /documents      → Documents   │  AppLayout AND
//    /quiz           → Quiz        │  ProtectedRoute
//    /flashcards     → Flashcards  │  (requires login)
//    /progress       → Progress    ┘
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AITutor from './pages/AITutor';
import Documents from './pages/Documents';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import Progress from './pages/Progress';

const App = () => (
  <BrowserRouter>
    {/*
      AuthProvider must be INSIDE BrowserRouter because
      it uses useNavigate() internally.
    */}
    <AuthProvider>
      <Routes>

        {/* ── Public routes ──────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes ───────────────────────────── */}
        {/*
          AppLayout renders the sidebar + navbar.
          ProtectedRoute checks the JWT before rendering.
        */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/progress" element={<Progress />} />
        </Route>

        {/* ── Fallbacks ──────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
