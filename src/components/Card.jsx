// ============================================================
//  Card.jsx
//  A generic white rounded card with optional shadow and hover.
//  Usage:
//    <Card>content</Card>
//    <Card hoverable padding="24px">content</Card>
// ============================================================

import React from 'react';

const Card = ({
  children,
  padding = '20px',
  hoverable = false,
  style = {},
  className = '',
  onClick,
}) => {
  const cardStyle = {
    background: '#fff',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--gray-200)',
    boxShadow: 'var(--shadow-sm)',
    padding,
    transition: 'box-shadow var(--transition-fast), transform var(--transition-fast)',
    cursor: hoverable ? 'pointer' : undefined,
    ...style,
  };

  return (
    <div
      style={cardStyle}
      className={`${hoverable ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}

      {hoverable && (
        <style>{`
          .card-hover:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
          }
        `}</style>
      )}
    </div>
  );
};

export default Card;
