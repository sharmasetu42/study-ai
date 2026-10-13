// ============================================================
//  LoadingSpinner.jsx
//  A lightweight CSS-animated spinning circle.
//  Usage:  <LoadingSpinner />
//          <LoadingSpinner size={24} color="#7c3aed" />
// ============================================================

import React from 'react';

const LoadingSpinner = ({ size = 20, color = 'var(--primary-600)' }) => {
  const style = {
    width: size,
    height: size,
    border: `2.5px solid ${color}30`, // faint outer ring
    borderTop: `2.5px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  };

  return (
    <>
      <div style={style} aria-label="Loading" role="status" />
      {/* spin keyframe is defined in index.css */}
    </>
  );
};

export default LoadingSpinner;
