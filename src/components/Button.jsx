// ============================================================
//  Button.jsx
//  A reusable button component with multiple variants and sizes.
//  Usage:
//    <Button>Click me</Button>
//    <Button variant="outline" size="sm">Small</Button>
//    <Button variant="ghost" loading>Saving…</Button>
// ============================================================

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

// variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
// size:    'sm' | 'md' | 'lg'
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,       // Lucide icon element shown before children
  iconRight = null,  // Lucide icon element shown after children
  fullWidth = false,
  onClick,
  type = 'button',
  style = {},
  className = '',
}) => {
  // ── Base styles shared by every variant ────────────────────
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid transparent',
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    opacity: loading || disabled ? 0.65 : 1,
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : undefined,
  };

  // ── Size styles ─────────────────────────────────────────────
  const sizes = {
    sm: { padding: '6px 14px', fontSize: '0.8125rem' },
    md: { padding: '9px 20px', fontSize: '0.9rem'    },
    lg: { padding: '12px 28px', fontSize: '1rem'     },
  };

  // ── Variant styles ──────────────────────────────────────────
  const variants = {
    primary: {
      background: 'var(--primary-600)',
      color: '#fff',
      borderColor: 'var(--primary-600)',
    },
    secondary: {
      background: 'var(--secondary-600)',
      color: '#fff',
      borderColor: 'var(--secondary-600)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary-600)',
      borderColor: 'var(--primary-300)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--gray-600)',
      borderColor: 'transparent',
    },
    danger: {
      background: 'var(--error-500)',
      color: '#fff',
      borderColor: 'var(--error-500)',
    },
    success: {
      background: 'var(--success-500)',
      color: '#fff',
      borderColor: 'var(--success-500)',
    },
  };

  const combinedStyle = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  return (
    <button
      type={type}
      style={combinedStyle}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-hover ${className}`}
    >
      {/* Show spinner on the left when loading */}
      {loading && <LoadingSpinner size={16} color="currentColor" />}
      {!loading && icon && icon}
      {children}
      {iconRight && iconRight}

      {/* Inline hover style using a <style> tag scoped to class */}
      <style>{`
        .btn-hover:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .btn-hover:active:not(:disabled) {
          transform: translateY(0);
          filter: brightness(0.96);
        }
      `}</style>
    </button>
  );
};

export default Button;
