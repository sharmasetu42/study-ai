// ============================================================
//  Navbar.jsx
//  Top header bar shown inside the main content area.
//  Contains: page title, search, notification bell, avatar.
//  On mobile it also shows the hamburger menu button.
// ============================================================

import React, { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { currentUser as mockUser } from '../data/mockData';

// Small initials avatar (same helper as Sidebar, kept local)
const Avatar = ({ name, size = 34 }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.34, fontWeight: 700,
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      {initials}
    </div>
  );
};

const Navbar = ({ onMobileMenuToggle, mobileMenuOpen }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useAuth();
  const currentUser = user || mockUser;

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: '#fff',
        borderBottom: '1px solid var(--gray-200)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* ── Mobile hamburger ─────────────────────────────────── */}
      <button
        onClick={onMobileMenuToggle}
        aria-label="Toggle menu"
        className="mobile-only-flex"
        style={{
          display: 'none',   // shown via CSS media query
          width: 36, height: 36,
          borderRadius: 'var(--radius-md)',
          background: 'var(--gray-100)',
          border: 'none', cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--gray-600)',
          flexShrink: 0,
        }}
      >
        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* ── Search bar ───────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          maxWidth: 480,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: searchFocused ? '#fff' : 'var(--gray-100)',
          border: `1.5px solid ${searchFocused ? 'var(--primary-400)' : 'transparent'}`,
          borderRadius: 'var(--radius-xl)',
          padding: '8px 14px',
          transition: 'all var(--transition-fast)',
        }}
      >
        <Search size={16} color={searchFocused ? 'var(--primary-500)' : 'var(--gray-400)'} />
        <input
          type="text"
          placeholder="Search anything…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '0.9rem',
            color: 'var(--gray-800)',
          }}
        />
      </div>

      {/* ── Spacer ───────────────────────────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── Notification bell ────────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setNotifOpen((v) => !v)}
          style={{
            width: 38, height: 38,
            borderRadius: 'var(--radius-md)',
            background: 'var(--gray-100)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gray-600)',
            position: 'relative',
            transition: 'background var(--transition-fast)',
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Red dot badge */}
          <span
            style={{
              position: 'absolute', top: 7, right: 7,
              width: 8, height: 8,
              background: 'var(--error-500)',
              borderRadius: '50%',
              border: '1.5px solid #fff',
            }}
          />
        </button>

        {/* Notification dropdown */}
        {notifOpen && (
          <div
            style={{
              position: 'absolute', right: 0, top: 46,
              background: '#fff',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              width: 300,
              zIndex: 200,
              animation: 'slideUp 0.2s ease',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--gray-100)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-800)' }}>
                Notifications
              </span>
              <button
                onClick={() => setNotifOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
              >
                <X size={14} />
              </button>
            </div>

            {[
              { text: 'Your quiz result is ready', time: '2m ago' },
              { text: 'New flashcard deck added', time: '1h ago' },
              { text: 'Document processing complete', time: '2h ago' },
            ].map((n, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--gray-100)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
                className="notif-row"
              >
                <p style={{ fontSize: '0.83rem', color: 'var(--gray-700)', fontWeight: 500 }}>
                  {n.text}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 3 }}>
                  {n.time}
                </p>
              </div>
            ))}
            <style>{`.notif-row:hover { background: var(--gray-50); }`}</style>
          </div>
        )}
      </div>

      {/* ── User info ────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={currentUser.name || currentUser.fullName || 'User'} size={34} />
        <div className="hide-on-mobile">
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.2 }}>
            {currentUser.firstName || (currentUser.fullName || '').split(' ')[0]}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>
            {currentUser.year}
          </p>
        </div>
      </div>

      {/* ── Responsive overrides ─────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-only-flex { display: flex !important; }
          .hide-on-mobile   { display: none  !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
