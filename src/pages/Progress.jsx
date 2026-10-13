// ============================================================
//  Progress.jsx  –  Connected to real backend
//  Fetches aggregated stats from GET /api/progress
//  Falls back to mock data if backend is not running.
// ============================================================

import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import ProgressCircle from '../components/ProgressCircle';
import SubjectProgress from '../components/SubjectProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

import { getProgress } from '../services/progressService';
import { getQuizHistory } from '../services/quizService';

import {
  subjectProgressData as mockSubjects,
  weeklyActivity as mockWeekly,
  weakTopics, studyProgress as mockStats,
  quizPerformanceSummary as mockQuizSummary,
} from '../data/mockData';

// ── SVG bar chart ─────────────────────────────────────────────
const WeeklyChart = ({ data }) => {
  const maxH = Math.max(...data.map(d => d.hours), 1);
  const BAR_W = 32, CHART_H = 120, GAP = 14;
  const totalW = data.length * (BAR_W + GAP) - GAP;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width="100%" viewBox={`0 0 ${totalW + 20} ${CHART_H + 36}`} style={{ minWidth: totalW + 20 }}>
        {data.map((d, i) => {
          const barH = Math.max((d.hours / maxH) * CHART_H, 4);
          const x = i * (BAR_W + GAP) + 10, y = CHART_H - barH;
          const isToday = i === new Date().getDay() - 1;
          return (
            <g key={d.day}>
              <rect x={x} y={y} width={BAR_W} height={barH} rx={6}
                fill={isToday ? 'var(--primary-600)' : 'var(--primary-200)'} />
              <text x={x + BAR_W / 2} y={y - 5} textAnchor="middle" fontSize="10"
                fill={isToday ? 'var(--primary-700)' : 'var(--gray-500)'}
                fontWeight={isToday ? '700' : '400'}>{d.hours}h</text>
              <text x={x + BAR_W / 2} y={CHART_H + 18} textAnchor="middle" fontSize="11"
                fill={isToday ? 'var(--primary-700)' : 'var(--gray-500)'}
                fontWeight={isToday ? '700' : '400'}>{d.day}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title, subtitle, color = 'var(--primary-600)' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
    <div style={{ width: 36, height: 36, background: `${color}18`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} color={color} />
    </div>
    <div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 1 }}>{subtitle}</p>}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
const Progress = () => {
  const { showToast, ToastContainer } = useToast();
  const [stats, setStats] = useState(null);
  const [quizHist, setQuizHist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prog, quizzes] = await Promise.all([getProgress(), getQuizHistory()]);
      setStats(prog);
      setQuizHist(quizzes);
    } catch {
      // Backend not running — use mock data
      setStats({ ...mockStats, avgScore: mockQuizSummary.averageScore, subjectProgress: mockSubjects.map(s => ({ subject: s.subject, percent: s.percent })) });
      setQuizHist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Resolved data
  const overallPct = stats?.avgScore || stats?.overallPercent || 0;
  const totalHours = mockWeekly.reduce((s, d) => s + d.hours, 0);
  const subjectData = (stats?.subjectProgress?.length > 0)
    ? stats.subjectProgress.map((s, i) => ({ ...s, color: mockSubjects[i % mockSubjects.length]?.color || 'var(--primary-600)' }))
    : mockSubjects;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <LoadingSpinner size={40} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)' }}>
            Your Learning Progress
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginTop: 4 }}>Track your performance and stay motivated</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={fetchData}>Refresh</Button>
          <Button variant="primary" icon={<Sparkles size={14} />}>Generate Study Plan →</Button>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 14 }}>
        {[
          { label: 'Overall Progress', value: `${overallPct}%`, color: 'var(--primary-600)', bg: 'var(--primary-50)' },
          { label: 'Topics Completed', value: stats?.topicsCompleted ?? mockStats.topicsCompleted, color: 'var(--success-600)', bg: 'var(--success-50)' },
          { label: 'Quizzes Completed', value: stats?.quizzesCompleted ?? mockStats.quizzesCompleted, color: 'var(--secondary-600)', bg: '#eff6ff' },
          { label: 'Questions Answered', value: stats?.questionsAnswered ?? mockStats.questionsAnswered, color: 'var(--warning-600)', bg: 'var(--warning-50)' },
          { label: 'Avg Quiz Score', value: `${overallPct}%`, color: 'var(--error-600)', bg: 'var(--error-50)' },
        ].map(s => (
          <Card key={s.label} padding="16px" style={{ background: s.bg, border: `1px solid ${s.color}20` }}>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: 5 }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Two-column section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 20 }} className="progress-cols">

        {/* Weekly activity */}
        <Card padding="24px">
          <SectionTitle icon={TrendingUp} title="Weekly Study Activity" subtitle={`Total this week: ${totalHours}h`} />
          <WeeklyChart data={mockWeekly} />
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 8, textAlign: 'right' }}>
            Daily avg: <strong style={{ color: 'var(--primary-600)' }}>{(totalHours / mockWeekly.length).toFixed(1)}h</strong>
          </p>
        </Card>

        {/* Quiz performance */}
        <Card padding="24px" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <SectionTitle icon={Target} title="Quiz Performance" subtitle="Average score across all quizzes" color="var(--secondary-600)" />
          <ProgressCircle percent={overallPct} size={130} strokeWidth={12} color="var(--secondary-600)" />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Total Quizzes', value: stats?.quizzesCompleted ?? quizHist.length },
              { label: 'Best Subject', value: mockQuizSummary.bestSubject },
              { label: 'Average Score', value: `${overallPct}%` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span style={{ fontSize: '0.83rem', color: 'var(--gray-600)' }}>{r.label}</span>
                <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--secondary-600)' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Subject progress */}
      <Card padding="24px">
        <SectionTitle icon={TrendingUp} title="Subject Progress" subtitle="Performance by topic" color="var(--success-600)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {subjectData.map(s => (
            <SubjectProgress key={s.subject} subject={s.subject} percent={s.percent} color={s.color} />
          ))}
        </div>
      </Card>

      {/* Weak topics */}
      <Card padding="24px" style={{ borderLeft: '4px solid var(--warning-500)' }}>
        <SectionTitle icon={AlertTriangle} title="Weak Topics" subtitle="Areas that need more attention" color="var(--warning-600)" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {weakTopics.map(topic => (
            <div key={topic} style={{ padding: '8px 16px', background: 'var(--warning-50)', border: '1.5px solid var(--warning-500)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--warning-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} /> {topic}
            </div>
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: '0.83rem', color: 'var(--gray-500)' }}>
          Generate a focused study plan to improve these areas.
        </p>
        <Button variant="outline" size="sm" style={{ marginTop: 12 }} icon={<Sparkles size={13} />}
          onClick={() => showToast('Study plan feature coming soon!', 'default')}>
          Generate Study Plan →
        </Button>
      </Card>

      <ToastContainer />

      <style>{`@media (max-width: 900px) { .progress-cols { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default Progress;
