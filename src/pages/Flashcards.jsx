// ============================================================
//  Flashcards.jsx
//  Interactive flashcard deck with:
//   - Flip animation (handled in Flashcard component)
//   - Prev / Next navigation
//   - Shuffle deck
//   - Mark difficult
//   - Progress bar
// ============================================================

import React, { useState, useCallback } from 'react';
import { Shuffle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

import Card       from '../components/Card';
import Button     from '../components/Button';
import Flashcard  from '../components/Flashcard';
import ProgressBar from '../components/ProgressBar';
import { flashcards as originalCards } from '../data/mockData';

// ── Fisher-Yates shuffle ─────────────────────────────────────
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Flashcards = () => {
  const [cards, setCards]           = useState(originalCards);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [difficultSet, setDifficult] = useState(new Set()); // card IDs marked difficult
  const [reviewed, setReviewed]     = useState(new Set());  // card IDs seen

  const card       = cards[currentIdx];
  const total      = cards.length;
  const progress   = Math.round(((currentIdx + 1) / total) * 100);
  const isDifficult = difficultSet.has(card.id);

  // Mark current card as viewed
  const markReviewed = useCallback((idx) => {
    setReviewed((prev) => new Set(prev).add(cards[idx].id));
  }, [cards]);

  const handleNext = () => {
    if (currentIdx < total - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      markReviewed(next);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((v) => v - 1);
  };

  const handleShuffle = () => {
    setCards(shuffle(originalCards));
    setCurrentIdx(0);
    setReviewed(new Set([cards[0]?.id]));
  };

  const handleMarkDifficult = () => {
    setDifficult((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) next.delete(card.id);
      else next.add(card.id);
      return next;
    });
  };

  const handleReset = () => {
    setCards(originalCards);
    setCurrentIdx(0);
    setDifficult(new Set());
    setReviewed(new Set());
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page header ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)' }}>
            Flashcards
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginTop: 4 }}>
            Quickly review important concepts — click a card to flip it
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="outline" size="sm"
            icon={<Shuffle size={14} />}
            onClick={handleShuffle}
          >
            Shuffle
          </Button>
          <Button
            variant="ghost" size="sm"
            icon={<RotateCcw size={14} />}
            onClick={handleReset}
            style={{ color: 'var(--gray-500)' }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Cards',  value: total,                    color: 'var(--primary-600)' },
          { label: 'Reviewed',     value: reviewed.size,            color: 'var(--success-600)' },
          { label: 'Difficult',    value: difficultSet.size,        color: 'var(--warning-600)' },
          { label: 'Remaining',    value: total - reviewed.size,    color: 'var(--gray-500)'    },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1, minWidth: 90,
              padding: '12px 14px',
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>
              {s.value}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Progress ─────────────────────────────────────────── */}
      <Card padding="16px">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)' }}>
            Card {currentIdx + 1} of {total}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)' }}>
            {progress}%
          </span>
        </div>
        <ProgressBar percent={progress} height={8} />

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 5, marginTop: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {cards.map((c, i) => (
            <div
              key={c.id}
              onClick={() => { setCurrentIdx(i); markReviewed(i); }}
              style={{
                width: 10, height: 10, borderRadius: '50%', cursor: 'pointer',
                background:
                  i === currentIdx     ? 'var(--primary-600)' :
                  difficultSet.has(c.id) ? 'var(--warning-500)' :
                  reviewed.has(c.id)   ? 'var(--success-500)' :
                  'var(--gray-300)',
                transition: 'background var(--transition-fast)',
              }}
              title={`Card ${i + 1}`}
            />
          ))}
        </div>
      </Card>

      {/* ── Flashcard ────────────────────────────────────────── */}
      <Flashcard
        card={card}
        difficult={isDifficult}
        onMarkDifficult={handleMarkDifficult}
      />

      {/* ── Navigation ──────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outline"
          icon={<ChevronLeft size={16} />}
          onClick={handlePrev}
          disabled={currentIdx === 0}
        >
          Previous
        </Button>

        <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
          {reviewed.size} of {total} reviewed
        </span>

        <Button
          variant="primary"
          iconRight={<ChevronRight size={16} />}
          onClick={handleNext}
          disabled={currentIdx === total - 1}
        >
          Next
        </Button>
      </div>

      {/* ── Difficult cards list ─────────────────────────────── */}
      {difficultSet.size > 0 && (
        <Card padding="20px">
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--warning-600)', marginBottom: 12 }}>
            ⚡ Difficult Cards ({difficultSet.size})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cards
              .filter((c) => difficultSet.has(c.id))
              .map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '10px 14px',
                    background: 'var(--warning-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--warning-500)',
                    fontSize: '0.85rem', color: 'var(--warning-700)', fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  onClick={() => setCurrentIdx(cards.indexOf(c))}
                >
                  {c.question}
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Flashcards;
