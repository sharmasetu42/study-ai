// ============================================================
//  Sidebar.jsx
//  Left navigation sidebar for desktop.
//  - Highlights the active route
//  - Collapses to icon-only on tablet
//  - Hidden on mobile (replaced by bottom nav in AppLayout)
//  Props:
//    collapsed  – boolean: icon-only mode
//    onToggle   – fn: called when hamburger is clicked
// ============================================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BrainCircuit, FolderOpen,
  ClipboardList, BookOpen, BarChart3,
  Settings, HelpCircle, LogOut, GraduationCap,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { currentUser } from '../data/mockData';

// ── Navigation items ─────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'AI Tutor', icon: BrainCircuit, path: '/ai-tutor' },
  { label: 'My Documents', icon: FolderOpen, path: '/documents' },
  { label: 'Quiz', icon: ClipboardList, path: '/quiz' },
  { label: 'Flashcards', icon: BookOpen, path: '/flashcards' },
  { label: 'Progress', icon: BarChart3, path: '/progress' },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Help & Support', icon: HelpCircle, path: '/help' },
];

// ── Initials avatar ──────────────────────────────────────────
const Avatar = ({ name, size = 36 }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.35, fontWeight: 700,
        flexShrink: 0,
        fontFamily: 'var(--font-heading)',
      }}
    >
      {initials}
    </div>
  );
};

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // Use real user from auth context, fall back to mockData
  const displayUser = user || currentUser;

  // Width based on collapsed state
  const w = collapsed ? 72 : 260;

  return (
    <aside
      style={{
        width: w,
        minHeight: '100vh',
        background: '#fff',
        borderRight: '1px solid var(--gray-200)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* ── Logo + collapse toggle ──────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '20px 0' : '20px 18px',
          borderBottom: '1px solid var(--gray-100)',
          minHeight: 72,
        }}
      >
        {!collapsed && (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            {/* Logo icon */}
            <div
              style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-500))',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <GraduationCap size={20} color="#fff" />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-500))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                StudyAI
              </span>
            </div>
          </div>
        )}

        {/* Collapse toggle button */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            width: 28, height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--gray-100)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gray-500)',
            transition: 'background var(--transition-fast)',
            flexShrink: 0,
          }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ── Main navigation ─────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '11px 0' : '11px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-50)' : 'transparent',
                  color: isActive ? 'var(--primary-700)' : 'var(--gray-600)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  borderLeft: isActive ? '3px solid var(--primary-600)' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                })}
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={19}
                      color={isActive ? 'var(--primary-600)' : 'var(--gray-500)'}
                      style={{ flexShrink: 0 }}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Bottom section ───────────────────────────────────── */}
      <div style={{ padding: '10px 10px 0', borderTop: '1px solid var(--gray-100)' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {BOTTOM_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: collapsed ? '10px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  background: 'transparent',
                  color: 'var(--gray-500)',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
                className="sidebar-bottom-btn"
              >
                <item.icon size={17} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── User profile card ────────────────────────────────── */}
      <div
        style={{
          padding: collapsed ? '14px 0' : '14px 14px',
          borderTop: '1px solid var(--gray-100)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
          cursor: 'pointer',
        }}
        title={collapsed ? (displayUser.name || displayUser.fullName) : undefined}
      >
        <Avatar name={displayUser.name || displayUser.fullName || 'User'} size={36} />
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayUser.name || displayUser.fullName}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
              {displayUser.year}
            </p>
          </div>
        )}
        {!collapsed && (
          <button
            title="Logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 4, borderRadius: 6, flexShrink: 0 }}
            onClick={logout}
          >
            <LogOut size={15} />
          </button>
        )}
      </div>

      <style>{`
        .sidebar-bottom-btn:hover { background: var(--gray-100) !important; color: var(--gray-700) !important; }
      `}</style>
    </aside>
  );
};

export default Sidebar;
