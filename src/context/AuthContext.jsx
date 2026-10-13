// ============================================================
//  src/context/AuthContext.jsx
//  Global auth state — provides user, login, logout to all pages.
//
//  How it works:
//   1. On app load, reads saved user from localStorage (instant)
//   2. Also validates token with backend (background check)
//   3. Any page can call useAuth() to get the current user
//   4. Login / Register / Logout update the global state
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  loginUser, registerUser, logoutUser,
  getSavedUser, getMe, isAuthenticated,
} from '../services/authService';

// Create the context object
const AuthContext = createContext(null);

// ── Provider component (wraps the whole app) ─────────────────
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize user from localStorage so the page doesn't flash
  const [user,    setUser]    = useState(getSavedUser);
  const [loading, setLoading] = useState(true); // true while validating token

  // ── On mount: verify saved token with backend ─────────────
  useEffect(() => {
    const verifyToken = async () => {
      if (isAuthenticated()) {
        try {
          const res = await getMe();
          setUser(res.user);
          // Update localStorage with fresh data
          localStorage.setItem('studyai_user', JSON.stringify(res.user));
        } catch {
          // Token invalid or expired — clear everything
          logoutUser();
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    setUser(res.user);
    navigate('/dashboard');
    return res;
  };

  // ── Register ───────────────────────────────────────────────
  const register = async (fullName, email, password) => {
    const res = await registerUser({ fullName, email, password });
    setUser(res.user);
    navigate('/dashboard');
    return res;
  };

  // ── Logout ─────────────────────────────────────────────────
  const logout = () => {
    logoutUser();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom hook: useAuth() ────────────────────────────────────
// Usage in any component:
//   const { user, login, logout } = useAuth();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
