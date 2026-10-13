// ============================================================
//  ProgressBar.jsx
//  A horizontal progress bar with animated fill.
//  Usage:
//    <ProgressBar percent={72} />
//    <ProgressBar percent={54} color="#3b82f6" height={8} />
// ============================================================

import React from 'react';

const ProgressBar = ({
  percent = 0,
  color = 'var(--primary-600)',
  height = 8,
  showLabel = false,
  style = {},
}) => {
  // Clamp between 0 and 100
  const value = Math.min(100, Math.max(0, percent));

  return (
    <div style={{ width: '100%', ...style }}>
      {/* Track (background) */}
      <div
        style={{
          width: '100%',
          height,
          background: 'var(--gray-200)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>

      {/* Optional text label to the right */}
      {showLabel && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--gray-500)',
            marginTop: 4,
            display: 'block',
            textAlign: 'right',
          }}
        >
          {value}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
