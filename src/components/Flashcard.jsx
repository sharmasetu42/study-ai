// ============================================================
//  Flashcard.jsx
//  A single flip-card: shows question on front, answer on back.
//  Uses CSS 3D transform for smooth flip animation.
// ============================================================

import React, { useState } from 'react';
import Button from './Button';

const Flashcard = ({ card, difficult = false, onMarkDifficult }) => {
  const [flipped, setFlipped] = useState(false);

  // Reset flip when card changes
  React.useEffect(() => { setFlipped(false); }, [card?.id]);

  const cardStyle = {
    width: '100%',
    height: '300px',
    position: 'relative',
    // This enables 3D perspective for child transforms
    perspective: '1200px',
    cursor: 'pointer',
  };

  const innerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  };

  const faceBase = {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: 'var(--radius-xl)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--gray-200)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      {/* Card */}
      <div style={cardStyle} onClick={() => setFlipped((v) => !v)}>
        <div style={innerStyle}>
          {/* FRONT – Question */}
          <div
            style={{
              ...faceBase,
              background: 'linear-gradient(135deg, var(--primary-50) 0%, #fff 100%)',
            }}
          >
            <div
              style={{
                width: 48, height: 48,
                background: 'var(--primary-100)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20, fontSize: '1.2rem',
              }}
            >
              ❓
            </div>
            <p
              style={{
                fontSize: '1.1rem', fontWeight: 700,
                color: 'var(--gray-900)', lineHeight: 1.4,
                fontFamily: 'var(--font-heading)',
              }}
            >
              {card.question}
            </p>
            <p
              style={{
                fontSize: '0.78rem', color: 'var(--primary-500)',
                marginTop: 20, fontWeight: 500,
              }}
            >
              Click to reveal answer
            </p>

            {/* Difficult badge */}
            {difficult && (
              <span
                style={{
                  position: 'absolute', top: 14, right: 14,
                  background: 'var(--warning-50)',
                  color: 'var(--warning-600)',
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '3px 8px', borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--warning-500)',
                }}
              >
                ⚡ Difficult
              </span>
            )}
          </div>

          {/* BACK – Answer (rotated 180deg so it shows when parent flips) */}
          <div
            style={{
              ...faceBase,
              background: 'linear-gradient(135deg, #fff 0%, var(--primary-50) 100%)',
              transform: 'rotateY(180deg)',
            }}
          >
            <div
              style={{
                width: 48, height: 48,
                background: 'var(--success-50)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20, fontSize: '1.2rem',
              }}
            >
              💡
            </div>
            <p
              style={{
                fontSize: '0.95rem', color: 'var(--gray-700)',
                lineHeight: 1.65, fontWeight: 500,
              }}
            >
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFlipped((v) => !v)}
        >
          {flipped ? 'Show Question' : 'Show Answer'}
        </Button>
        <Button
          variant={difficult ? 'warning' : 'ghost'}
          size="sm"
          style={difficult ? {
            background: 'var(--warning-50)',
            color: 'var(--warning-600)',
            borderColor: 'var(--warning-500)',
          } : {}}
          onClick={(e) => { e.stopPropagation(); onMarkDifficult && onMarkDifficult(); }}
        >
          {difficult ? '⚡ Difficult' : 'Mark Difficult'}
        </Button>
      </div>
    </div>
  );
};

export default Flashcard;
