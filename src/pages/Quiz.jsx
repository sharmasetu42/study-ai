// ============================================================
//  Quiz.jsx  –  Connected to real backend
//  Flow:
//    Intro → question by question → finish → POST /api/quiz/submit
//    Results page shows score + saves to DB
//    Falls back gracefully if backend is offline
// ============================================================

import React, { useState } from 'react';
import {
  Trophy, RotateCcw, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Save,
} from 'lucide-react';

import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';
import { useToast } from '../components/Toast';

import { submitQuiz } from '../services/quizService';
import { quizQuestions } from '../data/mockData';

const SCREEN = { INTRO: 'intro', QUIZ: 'quiz', RESULT: 'result' };

// ── Intro screen ──────────────────────────────────────────────
const IntroScreen = ({ onStart }) => (
  <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
    <Card padding="40px">
      <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🧠</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8 }}>
        Java OOP Quiz
      </h2>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 24 }}>
        Test your knowledge with {quizQuestions.length} questions. Your results will be saved to your profile.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Questions', value: quizQuestions.length, emoji: '❓' },
          { label: 'Topic', value: 'Java OOP', emoji: '☕' },
          { label: 'Difficulty', value: 'Medium', emoji: '⚡' },
          { label: 'Saves to', value: 'Your Profile', emoji: '💾' },
        ].map(item => (
          <div key={item.label} style={{ padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <p style={{ fontSize: '1.3rem', marginBottom: 4 }}>{item.emoji}</p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)' }}>{item.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.label}</p>
          </div>
        ))}
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={onStart}>
        Start Quiz →
      </Button>
    </Card>
  </div>
);

// ── Result screen ─────────────────────────────────────────────
const ResultScreen = ({ answers, onRetry, saving, saved }) => {
  const correct = answers.filter(a => a.correct).length;
  const total = answers.length;
  const accuracy = Math.round((correct / total) * 100);

  const grade =
    accuracy >= 90 ? { label: 'Excellent!', color: 'var(--success-600)', emoji: '🏆' } :
      accuracy >= 70 ? { label: 'Good Job!', color: 'var(--primary-600)', emoji: '🎉' } :
        { label: 'Keep Practicing', color: 'var(--warning-600)', emoji: '💪' };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card padding="36px" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>{grade.emoji}</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: grade.color, marginBottom: 4 }}>
          {grade.label}
        </h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: 4 }}>Quiz Completed</p>

        {/* Save status badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: saved ? 'var(--success-50)' : 'var(--gray-100)', marginBottom: 24 }}>
          {saving
            ? <><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning-500)', display: 'inline-block' }} /><span style={{ fontSize: '0.75rem', color: 'var(--warning-600)', fontWeight: 600 }}>Saving to profile…</span></>
            : saved
              ? <><CheckCircle2 size={13} color="var(--success-600)" /><span style={{ fontSize: '0.75rem', color: 'var(--success-600)', fontWeight: 600 }}>Saved to profile</span></>
              : <><Save size={13} color="var(--gray-400)" /><span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Not saved (backend offline)</span></>
          }
        </div>

        {/* Big score */}
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, marginBottom: 28 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', fontWeight: 800, color: grade.color, lineHeight: 1 }}>{correct}</span>
          <span style={{ fontSize: '1.5rem', color: 'var(--gray-400)', fontWeight: 700 }}>/{total}</span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Accuracy', value: `${accuracy}%`, color: grade.color },
            { label: 'Correct', value: correct, color: 'var(--success-600)' },
            { label: 'Incorrect', value: total - correct, color: 'var(--error-500)' },
          ].map(s => (
            <div key={s.label} style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 3 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Per-question review */}
        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-700)', marginBottom: 10 }}>Answer Review</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {answers.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: a.correct ? 'var(--success-50)' : 'var(--error-50)', borderRadius: 'var(--radius-md)', border: `1px solid ${a.correct ? 'var(--success-500)' : 'var(--error-500)'}20` }}>
                {a.correct
                  ? <CheckCircle2 size={15} color="var(--success-500)" />
                  : <XCircle size={15} color="var(--error-500)" />}
                <span style={{ fontSize: '0.82rem', color: 'var(--gray-700)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Q{i + 1}: {quizQuestions[i]?.question}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth icon={<RotateCcw size={16} />} onClick={onRetry}>
          Retry Quiz
        </Button>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
const Quiz = () => {
  const { showToast, ToastContainer } = useToast();

  const [screen, setScreen] = useState(SCREEN.INTRO);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [startTime, setStartTime] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const question = quizQuestions[currentIdx];
  const totalQ = quizQuestions.length;
  const progressPct = (currentIdx / totalQ) * 100;
  const currentAns = answers[currentIdx];

  const handleStart = () => {
    setAnswers(Array(totalQ).fill(null));
    setCurrentIdx(0);
    setSaved(false);
    setStartTime(Date.now());
    setScreen(SCREEN.QUIZ);
  };

  const handleSelect = (idx) => {
    const updated = [...answers];
    updated[currentIdx] = {
      questionIndex: currentIdx,
      question: question.question,
      selectedIndex: idx,
      correctIndex: question.correctIndex,
      correct: idx === question.correctIndex,
    };
    setAnswers(updated);
  };

  // ── Submit to backend when quiz finishes ──────────────────
  const handleFinish = async (finalAnswers) => {
    setScreen(SCREEN.RESULT);
    setSaving(true);

    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    try {
      await submitQuiz({
        subject: 'Java OOP',
        answers: finalAnswers.filter(Boolean),
        timeTaken,
      });
      setSaved(true);
      showToast('Quiz result saved to your profile! 💾', 'success');
    } catch {
      // Backend offline — still show results, just not saved
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(v => v + 1);
    } else {
      handleFinish(answers);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(v => v - 1);
  };

  if (screen === SCREEN.INTRO) return <><IntroScreen onStart={handleStart} /><ToastContainer /></>;
  if (screen === SCREEN.RESULT) return (
    <>
      <ResultScreen
        answers={answers.filter(Boolean)}
        onRetry={handleStart}
        saving={saving}
        saved={saved}
      />
      <ToastContainer />
    </>
  );

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)' }}>
          Java OOP Quiz
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 3 }}>
          Question {currentIdx + 1} of {totalQ} · Results saved automatically
        </p>
      </div>

      {/* Progress */}
      <Card padding="16px">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>Progress</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>{Math.round(progressPct)}%</span>
        </div>
        <ProgressBar percent={progressPct} height={8} />

        {/* Question dot indicators */}
        <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
          {quizQuestions.map((_, i) => (
            <div key={i} onClick={() => setCurrentIdx(i)}
              style={{
                width: 22, height: 22, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, transition: 'all var(--transition-fast)',
                background: answers[i]
                  ? (answers[i].correct ? 'var(--success-500)' : 'var(--error-500)')
                  : i === currentIdx ? 'var(--primary-600)' : 'var(--gray-200)',
                color: (answers[i] || i === currentIdx) ? '#fff' : 'var(--gray-500)',
              }}>
              {i + 1}
            </div>
          ))}
        </div>
      </Card>

      {/* Question */}
      <Card padding="24px">
        <QuizCard
          question={question}
          selectedIndex={currentAns?.selectedIndex ?? null}
          onSelect={handleSelect}
        />
      </Card>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outline" icon={<ChevronLeft size={16} />} onClick={handlePrev} disabled={currentIdx === 0}>
          Previous
        </Button>

        <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
          {answers.filter(Boolean).length} / {totalQ} answered
        </span>

        <Button
          variant={currentIdx === totalQ - 1 ? 'success' : 'primary'}
          iconRight={<ChevronRight size={16} />}
          onClick={handleNext}
          disabled={!currentAns}
          style={currentIdx === totalQ - 1 ? { background: 'var(--success-600)', borderColor: 'var(--success-600)' } : {}}
        >
          {currentIdx === totalQ - 1 ? 'Finish & Save' : 'Next Question'}
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Quiz;
