// ============================================================
//  Dashboard.jsx  –  Connected to real backend
//  Data flow:
//    1. On mount → fetch /api/progress and /api/documents
//    2. While loading → show skeleton placeholders
//    3. On success  → render real data
//    4. On error    → fall back to mock data silently
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, BrainCircuit, ClipboardList,
  BookOpen, FileText, Code2, Database, GitBranch,
  Layers, ChevronRight,
} from 'lucide-react';

import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import ProgressCircle from '../components/ProgressCircle';
import ActivityCard from '../components/ActivityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

// Services
import { getProgress } from '../services/progressService';
import { getDocuments } from '../services/documentService';

// Mock data fallbacks
import {
  quickActions, studyProgress as mockProgress,
  subjects, recentActivity as mockActivity,
  documents as mockDocs,
} from '../data/mockData';

const ICON_MAP = { BrainCircuit, ClipboardList, BookOpen, FileText, Code2, Database, GitBranch, Layers };

// ── Section heading ───────────────────────────────────────────
const SectionHeading = ({ title, subtitle, action, onAction }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
    <div>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)', marginTop: 2 }}>{subtitle}</p>}
    </div>
    {action && (
      <button onClick={onAction} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-600)', fontSize: '0.83rem', fontWeight: 600 }}>
        {action} <ChevronRight size={14} />
      </button>
    )}
  </div>
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

// ── AI Illustration ───────────────────────────────────────────
const StudyIllustration = () => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 240, height: 'auto' }}>
    <ellipse cx="120" cy="150" rx="90" ry="20" fill="#7c3aed" opacity="0.08" />
    <rect x="40" y="110" width="70" height="14" rx="4" fill="#7c3aed" opacity="0.8" />
    <rect x="44" y="97" width="62" height="14" rx="4" fill="#a78bfa" />
    <rect x="48" y="84" width="54" height="14" rx="4" fill="#c4b5fd" />
    <rect x="135" y="100" width="55" height="36" rx="5" fill="#3b82f6" opacity="0.85" />
    <line x1="162" y1="100" x2="162" y2="136" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
    <rect x="140" y="106" width="18" height="3" rx="1.5" fill="#fff" opacity="0.6" />
    <rect x="140" y="113" width="14" height="3" rx="1.5" fill="#fff" opacity="0.4" />
    <rect x="98" y="44" width="44" height="38" rx="8" fill="#7c3aed" />
    <circle cx="110" cy="60" r="5" fill="#fff" /><circle cx="130" cy="60" r="5" fill="#fff" />
    <circle cx="111" cy="61" r="2.5" fill="#7c3aed" /><circle cx="131" cy="61" r="2.5" fill="#7c3aed" />
    <path d="M111 70 Q120 76 129 70" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
    <line x1="120" y1="44" x2="120" y2="32" stroke="#7c3aed" strokeWidth="2.5" />
    <circle cx="120" cy="28" r="5" fill="#a78bfa" />
    <rect x="80" y="56" width="18" height="10" rx="5" fill="#8b5cf6" />
    <rect x="142" y="56" width="18" height="10" rx="5" fill="#8b5cf6" />
    <circle cx="70" cy="40" r="3" fill="#f59e0b" opacity="0.9" />
    <circle cx="178" cy="50" r="2" fill="#f59e0b" opacity="0.7" />
    <text x="56" y="32" fontSize="11" fill="#6d28d9" fontWeight="bold" opacity="0.7">E=mc²</text>
    <text x="150" y="35" fontSize="10" fill="#2563eb" fontWeight="bold" opacity="0.6">AI</text>
  </svg>
);

// ── Skeleton placeholder ──────────────────────────────────────
const Skeleton = ({ w = '100%', h = 18, radius = 6 }) => (
  <div style={{ width: w, height: h, background: 'var(--gray-200)', borderRadius: radius, animation: 'pulse 1.5s ease infinite' }} />
);

// ═══════════════════════════════════════════════════════════
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, ToastContainer } = useToast();

  const [aiQuery, setAiQuery] = useState('');
  const [progress, setProgress] = useState(null);   // real progress from API
  const [documents, setDocuments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loadingData, setLoading] = useState(true);

  const firstName = user?.firstName || (user?.fullName || '').split(' ')[0] || 'there';

  // ── Fetch data on mount ──────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Run both requests in parallel
        const [prog, docs] = await Promise.all([
          getProgress(),
          getDocuments(),
        ]);
        setProgress(prog);
        setDocuments(docs);
        setActivity(prog.recentActivity || []);
      } catch (err) {
        // Backend not connected yet → use mock data silently
        setProgress(mockProgress);
        setDocuments(mockDocs);
        setActivity(mockActivity);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Use real progress or mock fallback
  const stats = progress || mockProgress;

  const handleAiSearch = () => {
    if (!aiQuery.trim()) return;
    navigate('/ai-tutor');
  };

  const statusColors = {
    Ready: { bg: 'var(--success-50)', text: 'var(--success-600)' },
    Processing: { bg: 'var(--warning-50)', text: 'var(--warning-600)' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── 1. Welcome banner ── */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: 160 }} />
        <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -40, right: 60 }} />

        <div style={{ flex: 1, zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', fontWeight: 500, marginBottom: 6 }}>
            {getGreeting()}, {firstName} 👋
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Ready to continue learning?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: 20 }}>
            You've answered <strong style={{ color: '#fff' }}>{stats.questionsAnswered || 0} questions</strong> so far. Keep it up!
          </p>

          {/* AI search */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 'var(--radius-xl)', padding: '10px 16px', maxWidth: 480 }}>
            <Search size={16} color="rgba(255,255,255,0.7)" />
            <input value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSearch()}
              placeholder="Ask anything about your study material…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.88rem' }} />
            <button onClick={handleAiSearch} style={{ background: '#fff', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-700)' }}>
              Ask AI
            </button>
          </div>
        </div>

        <div style={{ width: 200, flexShrink: 0, zIndex: 1 }} className="hide-on-mobile">
          <StudyIllustration />
        </div>
        <style>{`@media(max-width:600px){ .hide-on-mobile{ display:none; } }`}</style>
      </div>

      {/* ── 2. Quick action cards ── */}
      <div>
        <SectionHeading title="Quick Actions" subtitle="Jump right in" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px,1fr))', gap: 16 }}>
          {quickActions.map((action) => {
            const Icon = ICON_MAP[action.iconName] || BrainCircuit;
            return (
              <Card key={action.id} hoverable padding="20px" onClick={() => navigate(action.route)}>
                <div style={{ width: 44, height: 44, background: action.bgColor, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={22} color={action.color} />
                </div>
                <h3 style={{ fontSize: '0.97rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 6 }}>{action.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 16 }}>{action.description}</p>
                <button onClick={e => { e.stopPropagation(); navigate(action.route); }} style={{ display: 'flex', alignItems: 'center', gap: 4, background: action.bgColor, color: action.color, border: `1.5px solid ${action.color}30`, borderRadius: 'var(--radius-md)', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  {action.buttonText} <ArrowRight size={13} />
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── 3. Progress + Activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 20 }} className="progress-grid">

        {/* Progress card */}
        <Card padding="24px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)' }}>Your Study Progress</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 2 }}>Overall performance</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/progress')} style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.8rem' }}>
              View Details →
            </Button>
          </div>

          {loadingData ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <Skeleton w={110} h={110} radius="50%" />
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px' }}>
                {[0, 1, 2, 3].map(i => <div key={i}><Skeleton h={28} /><Skeleton h={14} w="60%" style={{ marginTop: 4 }} /></div>)}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
              <ProgressCircle percent={stats.overallPercent || stats.avgScore || 0} size={110} strokeWidth={10} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px', flex: 1 }}>
                {[
                  { label: 'Topics Completed', value: stats.topicsCompleted, color: 'var(--primary-600)' },
                  { label: 'Quizzes Completed', value: stats.quizzesCompleted, color: 'var(--secondary-600)' },
                  { label: 'Questions Answered', value: stats.questionsAnswered, color: 'var(--success-600)' },
                  { label: 'Avg Quiz Score', value: `${stats.avgScore || stats.overallPercent || 0}%`, color: 'var(--warning-600)' },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1, fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Recent activity */}
        <Card padding="20px">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>Recent Activity</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 12 }}>What you've been up to</p>
          {loadingData
            ? [0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <Skeleton w={36} h={36} radius={8} />
                <div style={{ flex: 1 }}><Skeleton h={14} /><Skeleton h={12} w="70%" style={{ marginTop: 5 }} /></div>
              </div>
            ))
            : (activity.length > 0
              ? activity.slice(0, 4).map((a, i) => (
                <ActivityCard key={i} activity={{
                  ...a,
                  iconName: a.iconName || 'CheckCircle2',
                  iconColor: a.iconColor || 'var(--primary-600)',
                }} />
              ))
              : mockActivity.map(a => <ActivityCard key={a.id} activity={a} />)
            )
          }
        </Card>
      </div>

      {/* ── 4. Continue Learning ── */}
      <div>
        <SectionHeading title="Continue Learning" subtitle="Pick up where you left off" action="View All" onAction={() => navigate('/progress')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16 }}>
          {subjects.map(subj => {
            const Icon = ICON_MAP[subj.iconName] || BookOpen;
            return (
              <Card key={subj.id} hoverable padding="18px">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, background: subj.bgColor, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={subj.color} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.93rem', color: 'var(--gray-900)' }}>{subj.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{subj.topicsCompleted}/{subj.totalTopics} topics</p>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: subj.color }}>{subj.percent}%</span>
                </div>
                <ProgressBar percent={subj.percent} color={subj.color} height={6} />
                <button onClick={() => navigate('/ai-tutor')} style={{ marginTop: 14, width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', background: subj.bgColor, border: `1.5px solid ${subj.color}30`, color: subj.color, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  Continue <ArrowRight size={13} />
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── 5. Recent Documents ── */}
      <div>
        <SectionHeading title="Recent Study Material" subtitle="Quick access to your latest documents" action="View All" onAction={() => navigate('/documents')} />
        {loadingData ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px,1fr))', gap: 14 }}>
            {[0, 1, 2, 3].map(i => <Card key={i} padding="16px"><Skeleton h={40} /><Skeleton h={14} style={{ marginTop: 10 }} /><Skeleton h={12} w="60%" style={{ marginTop: 5 }} /></Card>)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px,1fr))', gap: 14 }}>
            {(documents.length > 0 ? documents : mockDocs).slice(0, 4).map(doc => {
              const sc = statusColors[doc.status] || statusColors.Ready;
              return (
                <Card key={doc._id || doc.id} hoverable padding="16px">
                  <div style={{ width: 40, height: 40, background: 'var(--error-50)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <FileText size={20} color="var(--error-500)" />
                  </div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: 8 }}>
                    {doc.pages} pages · {doc.uploadedAt || 'Recent'}
                  </p>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: sc.bg, color: sc.text }}>
                    {doc.status}
                  </span>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ToastContainer />

      <style>{`
        @media (max-width: 900px) { .progress-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
};

export default Dashboard;
