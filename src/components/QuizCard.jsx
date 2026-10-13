// ============================================================
//  QuizCard.jsx
//  Renders a single quiz question with 4 options.
//  Shows correct / incorrect feedback after selection.
// ============================================================

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const QuizCard = ({ question, selectedIndex, onSelect }) => {
  const answered = selectedIndex !== null && selectedIndex !== undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Question text */}
      <p
        style={{
          fontSize: '1.05rem',
          fontWeight: 600,
          color: 'var(--gray-900)',
          lineHeight: 1.5,
          marginBottom: 4,
        }}
      >
        {question.question}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((option, idx) => {
          // Determine appearance based on answered state
          let bg = '#fff';
          let border = 'var(--gray-300)';
          let color = 'var(--gray-700)';
          let fontWeight = 500;

          if (answered) {
            if (idx === question.correctIndex) {
              bg = 'var(--success-50)'; border = 'var(--success-500)';
              color = 'var(--success-600)'; fontWeight = 600;
            } else if (idx === selectedIndex) {
              bg = 'var(--error-50)'; border = 'var(--error-500)';
              color = 'var(--error-600)'; fontWeight = 600;
            }
          } else if (idx === selectedIndex) {
            bg = 'var(--primary-50)'; border = 'var(--primary-400)';
            color = 'var(--primary-700)';
          }

          const isCorrect = answered && idx === question.correctIndex;
          const isWrong   = answered && idx === selectedIndex && idx !== question.correctIndex;

          return (
            <button
              key={idx}
              onClick={() => !answered && onSelect(idx)}
              disabled={answered}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 16px',
                background: bg,
                border: `1.5px solid ${border}`,
                borderRadius: 'var(--radius-md)',
                color,
                fontWeight,
                fontSize: '0.9rem',
                cursor: answered ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                fontFamily: 'var(--font-body)',
              }}
              className={!answered ? 'quiz-option' : ''}
            >
              {/* Letter label: A B C D */}
              <span
                style={{
                  width: 26, height: 26,
                  borderRadius: '50%',
                  background: answered
                    ? (isCorrect ? 'var(--success-500)' : isWrong ? 'var(--error-500)' : 'var(--gray-200)')
                    : 'var(--gray-200)',
                  color: (isCorrect || isWrong) ? '#fff' : 'var(--gray-600)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                }}
              >
                {['A', 'B', 'C', 'D'][idx]}
              </span>

              <span style={{ flex: 1 }}>{option}</span>

              {isCorrect && <CheckCircle2 size={18} color="var(--success-500)" />}
              {isWrong   && <XCircle     size={18} color="var(--error-500)"   />}
            </button>
          );
        })}
      </div>

      {/* Explanation shown after answering */}
      {answered && (
        <div
          style={{
            padding: '14px 16px',
            background: selectedIndex === question.correctIndex
              ? 'var(--success-50)' : 'var(--error-50)',
            border: `1px solid ${selectedIndex === question.correctIndex
              ? 'var(--success-500)' : 'var(--error-500)'}`,
            borderRadius: 'var(--radius-md)',
            animation: 'slideUp 0.2s ease',
          }}
        >
          <p
            style={{
              fontSize: '0.85rem',
              color: selectedIndex === question.correctIndex
                ? 'var(--success-600)' : 'var(--error-600)',
              fontWeight: 600, marginBottom: 4,
            }}
          >
            {selectedIndex === question.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>
            {question.explanation}
          </p>
        </div>
      )}

      <style>{`.quiz-option:hover { background: var(--gray-50); border-color: var(--primary-300); }`}</style>
    </div>
  );
};

export default QuizCard;
