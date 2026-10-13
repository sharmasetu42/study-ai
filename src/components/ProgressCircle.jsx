// ============================================================
//  ProgressCircle.jsx
//  An SVG-based circular progress indicator.
//  Usage:
//    <ProgressCircle percent={72} />
//    <ProgressCircle percent={72} size={120} strokeWidth={10} />
// ============================================================

import React from 'react';

const ProgressCircle = ({
  percent = 0,
  size = 100,
  strokeWidth = 9,
  color = 'var(--primary-600)',
  trackColor = 'var(--gray-200)',
  label = null,      // text inside the circle; defaults to percent%
}) => {
  // SVG maths: radius = half the size minus stroke width / 2
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = Math.min(100, Math.max(0, percent));
  // dashoffset: 0 = full circle, circumference = empty
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }} // start from top
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Animated fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>

      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {label ?? (
          <>
            <span
              style={{
                fontSize: size * 0.22,
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'var(--gray-900)',
                lineHeight: 1,
              }}
            >
              {value}%
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressCircle;
