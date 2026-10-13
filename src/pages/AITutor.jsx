// ============================================================
//  AITutor.jsx  –  Connected to real Gemini backend
//  Data flow:
//    User types → POST /api/ai/chat → Gemini → reply shown
//    Document selected → context sent with every message
//    Falls back to mock responses if backend not running
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, Trash2, ChevronDown, Sparkles, FileText } from 'lucide-react';

import Card from '../components/Card';
import Button from '../components/Button';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

import { sendChatMessage } from '../services/aiService';
import { getDocuments } from '../services/documentService';

import {
  initialAIMessage,
  sampleConversation,
  studyMaterials as mockMaterials,
} from '../data/mockData';

// ── Quick-prompt chips ────────────────────────────────────────
const QUICK_PROMPTS = [
  'Explain this in simple terms',
  'Give me an example',
  'Create a quiz question',
  'Summarize key points',
  'What are common exam questions?',
];

// ── Mock fallback responses (used when backend is offline) ────
const MOCK_RESPONSES = [
  { text: `Great question! Let me explain that concept.\n\n**Key Points:**\n• This is one of the core concepts in the subject.\n• It builds on what we've already covered.\n• Understanding this helps solve related problems.\n\nWant a practice question on this?` },
  {
    text: `Sure! Here's a simple explanation:\n\n**1. Definition** – The core meaning.\n**2. Example** – How it works in practice.\n**3. Why it matters** – Real-world importance.\n\nAny specific part you want me to dive deeper into?`,
    code: `// Example\npublic class Demo {\n    public static void main(String[] args) {\n        System.out.println("Hello, StudyAI!");\n    }\n}`
  },
  { text: `That's an important topic! Here's what you need to know:\n\nThink of it like a **black box** — you give it input and it produces output according to defined rules.\n\nFor your exam, remember: **encapsulation**, **abstraction**, and **modularity**.\n\nWant me to generate a quiz on this?` },
];

// ═══════════════════════════════════════════════════════════
const AITutor = () => {
  const { showToast, ToastContainer } = useToast();

  // Chat messages array
  const [messages, setMessages] = useState([initialAIMessage, ...sampleConversation]);
  const [loading, setLoading] = useState(false);

  // Documents loaded from backend
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [dropdownOpen, setDropdown] = useState(false);
  const [docsLoading, setDocsLoading] = useState(true);

  const bottomRef = useRef(null);

  // ── Auto-scroll to latest message ─────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Load user's documents for the selector ─────────────────
  useEffect(() => {
    const fetchDocs = async () => {
      setDocsLoading(true);
      try {
        const docs = await getDocuments();
        setDocuments(docs);
        // Auto-select first ready document
        const first = docs.find(d => d.status === 'Ready');
        if (first) setSelectedDocId(first._id);
      } catch {
        // Backend offline → use mock material names
        setDocuments([]);
      } finally {
        setDocsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ── Send message: try backend, fall back to mock ───────────
  const handleSend = useCallback(async (text) => {
    // 1. Add user message immediately
    const userMsg = { id: Date.now(), role: 'user', text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Build history for multi-turn context (last 10 messages)
      const history = [...messages, userMsg]
        .slice(-10)
        .filter(m => m.id !== 0) // skip the system welcome message
        .map(m => ({ role: m.role, text: m.text }));

      // 3. Call backend → Gemini
      const data = await sendChatMessage({
        message: text,
        documentId: selectedDocId || null,
        history,
      });

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: data.reply,
        time: now(),
      }]);

    } catch (err) {
      // Backend offline or API key not set → graceful mock fallback
      const resp = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: resp.text,
        code: resp.code,
        time: now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, selectedDocId]);

  const handleQuickPrompt = (prompt) => handleSend(prompt);

  const handleClear = () => {
    setMessages([initialAIMessage]);
    showToast('Chat cleared', 'default');
  };

  const handleRegenerate = () => {
    // Remove last AI message and re-ask the last user question
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUser) return;
    setMessages(prev => prev.filter(m => {
      // remove last AI message
      const lastAI = [...prev].reverse().find(m => m.role === 'ai');
      return m.id !== lastAI?.id;
    }));
    handleSend(lastUser.text);
  };

  // ── Selected document label ────────────────────────────────
  const selectedDoc = documents.find(d => d._id === selectedDocId);
  const selectedLabel = selectedDoc?.name?.replace('.pdf', '') || 'Select Document';
  const readyDocuments = documents.filter(d => d.status === 'Ready');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 20 }}>

      {/* Page header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)' }}>
          AI Tutor
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginTop: 4 }}>
          Ask questions about your study material — powered by Google Gemini
        </p>
      </div>

      {/* Main grid: chat + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 20, alignItems: 'start' }} className="tutor-grid">

        {/* ════ Chat column ════════════════════════════════ */}
        <Card padding="0" style={{ display: 'flex', flexDirection: 'column', height: '72vh', minHeight: 500 }}>

          {/* Toolbar */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>

            {/* Document selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdown(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'var(--primary-50)', border: '1.5px solid var(--primary-200)', borderRadius: 'var(--radius-md)', color: 'var(--primary-700)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <Sparkles size={14} />
                {docsLoading ? 'Loading docs…' : selectedLabel}
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div style={{ position: 'absolute', top: 38, left: 0, background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', minWidth: 220, zIndex: 50, overflow: 'hidden', animation: 'slideUp 0.15s ease' }}>
                  {/* Real documents */}
                  {readyDocuments.length > 0 ? (
                    readyDocuments.map(doc => (
                      <button key={doc._id} onClick={() => { setSelectedDocId(doc._id); setDropdown(false); showToast(`Using "${doc.name}" as context`, 'success'); }}
                        style={{ display: 'block', width: '100%', padding: '10px 14px', textAlign: 'left', background: selectedDocId === doc._id ? 'var(--primary-50)' : 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: selectedDocId === doc._id ? 'var(--primary-700)' : 'var(--gray-700)', fontWeight: selectedDocId === doc._id ? 600 : 400 }}
                        className="dd-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <FileText size={13} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{doc.name}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    /* Fallback to mock material names */
                    mockMaterials.map(m => (
                      <button key={m.id} onClick={() => { setSelectedDocId(null); setDropdown(false); }}
                        style={{ display: 'block', width: '100%', padding: '10px 14px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-700)' }}
                        className="dd-item">
                        {m.label}
                      </button>
                    ))
                  )}
                  <style>{`.dd-item:hover { background: var(--gray-50) !important; }`}</style>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />} onClick={handleRegenerate} style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                Regenerate
              </Button>
              <Button variant="ghost" size="sm" icon={<Trash2 size={13} />} onClick={handleClear} style={{ color: 'var(--error-500)', fontSize: '0.8rem' }}>
                Clear
              </Button>
            </div>
          </div>

          {/* Message list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LoadingSpinner size={16} />
                </div>
                <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gray-400)', display: 'inline-block', animation: `bounce 1.2s ease ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '10px 18px 0', borderTop: '1px solid var(--gray-100)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => handleQuickPrompt(p)}
                style={{ padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-600)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                className="chip-btn">
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 18px 16px' }}>
            <ChatInput onSend={handleSend} loading={loading} />
          </div>
        </Card>

        {/* ════ Right sidebar ════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Active document */}
          <Card padding="18px">
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Document</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: selectedDoc ? 'var(--primary-50)' : 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: `1px solid ${selectedDoc ? 'var(--primary-200)' : 'var(--gray-200)'}` }}>
              <div style={{ width: 34, height: 34, background: 'var(--error-50)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={16} color="var(--error-500)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: selectedDoc ? 'var(--primary-800)' : 'var(--gray-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                  {selectedDoc ? selectedDoc.name : 'No document selected'}
                </p>
                <p style={{ fontSize: '0.72rem', color: selectedDoc ? 'var(--primary-500)' : 'var(--gray-400)' }}>
                  {selectedDoc ? 'Ready to query' : 'Select a document above'}
                </p>
              </div>
            </div>
            {!selectedDoc && (
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 8, textAlign: 'center' }}>
                💡 Upload a PDF to ask specific questions about it
              </p>
            )}
          </Card>

          {/* Session stats */}
          <Card padding="18px">
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session Stats</p>
            {[
              { label: 'Messages', value: messages.length },
              { label: 'Questions', value: messages.filter(m => m.role === 'user').length },
              { label: 'AI Replies', value: messages.filter(m => m.role === 'ai').length },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span style={{ fontSize: '0.83rem', color: 'var(--gray-600)' }}>{s.label}</span>
                <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--primary-600)' }}>{s.value}</span>
              </div>
            ))}
          </Card>

          {/* AI status badge */}
          <Card padding="18px" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-500)', animation: 'pulse-dot 2s ease infinite' }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-700)' }}>Gemini AI Active</p>
            </div>
            {[
              'Be specific in your questions',
              'Ask for examples or code',
              'Request quizzes to test yourself',
              'Ask to simplify complex topics',
            ].map((tip, i) => (
              <p key={i} style={{ fontSize: '0.78rem', color: 'var(--primary-700)', marginBottom: 5, paddingLeft: 8, borderLeft: '2px solid var(--primary-300)' }}>{tip}</p>
            ))}
          </Card>
        </div>
      </div>

      <ToastContainer />

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .chip-btn:hover { background: var(--primary-50) !important; color: var(--primary-600) !important; border-color: var(--primary-300) !important; }
        @media (max-width: 900px) { .tutor-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default AITutor;
