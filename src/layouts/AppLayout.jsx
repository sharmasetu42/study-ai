// ============================================================
//  AppLayout.jsx
//  The main shell that wraps every authenticated page.
//
//  Desktop layout:
//    ┌──────────────┬────────────────────────────────────┐
//    │   Sidebar    │  Navbar (sticky top)               │
//    │  (260 px)    │  Page content (scrollable)         │
//    └──────────────┴────────────────────────────────────┘
//
//  Tablet: sidebar collapses to 72 px (icons only)
//  Mobile: sidebar hidden; bottom navigation bar shown
// ============================================================

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BrainCircuit, FolderOpen,
  ClipboardList, BookOpen, BarChart3,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar   from '../components/Navbar';

// Mobile bottom-nav items
const MOBILE_NAV = [
  { label: 'Home',       icon: LayoutDashboard, path: '/dashboard'  },
  { label: 'AI Tutor',   icon: BrainCircuit,    path: '/ai-tutor'   },
  { label: 'Docs',       icon: FolderOpen,      path: '/documents'  },
  { label: 'Quiz',       icon: ClipboardList,   path: '/quiz'       },
  { label: 'Flashcards', icon: BookOpen,        path: '/flashcards' },
  { label: 'Progress',   icon: BarChart3,       path: '/progress'   },
];

const AppLayout = () => {
  // Collapsed = icon-only sidebar (tablet mode)
  const [collapsed, setCollapsed] = useState(false);
  // Mobile drawer open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Track window width for responsive behaviour
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      // Auto-collapse sidebar on tablet
      if (w < 1024 && w >= 768) setCollapsed(true);
      if (w >= 1024) setCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // run once on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>

      {/* ── Desktop / Tablet Sidebar ──────────────────────── */}
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      )}

      {/* ── Mobile sidebar drawer overlay ─────────────────── */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 300,
              animation: 'fadeIn 0.2s ease',
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: 'fixed', left: 0, top: 0, bottom: 0,
              width: 260, zIndex: 400,
              animation: 'slideInLeft 0.25s ease',
            }}
          >
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
            />
          </div>
        </>
      )}

      {/* ── Main content area ──────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top navbar */}
        <Navbar
          onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
          mobileMenuOpen={mobileMenuOpen}
        />

        {/* Page content – Outlet renders the current route's page */}
        <main
          style={{
            flex: 1,
            padding: isMobile ? '16px 12px 80px' : '24px 28px',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom navigation bar ───────────────────── */}
      {isMobile && (
        <nav
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff',
            borderTop: '1px solid var(--gray-200)',
            display: 'flex',
            zIndex: 200,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
          }}
        >
          {MOBILE_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 4px',
                gap: 3,
                textDecoration: 'none',
                color: isActive ? 'var(--primary-600)' : 'var(--gray-400)',
                fontSize: '0.62rem',
                fontWeight: isActive ? 600 : 400,
                transition: 'color var(--transition-fast)',
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} color={isActive ? 'var(--primary-600)' : 'var(--gray-400)'} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Slide-in animation for mobile drawer */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0);     }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
