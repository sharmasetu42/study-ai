// ============================================================
//  ProtectedRoute.jsx
//  Wraps any route that requires login.
//  - If user is authenticated → render the page
//  - If loading (checking token) → show spinner
//  - If not authenticated → redirect to /login
// ============================================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Still checking localStorage / backend
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--gray-50)',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <LoadingSpinner size={40} />
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Loading StudyAI…</p>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
