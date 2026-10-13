// ============================================================
//  ChatMessage.jsx
//  Renders a single message in the AI Tutor chat.
//  role: 'user' | 'ai'
// ============================================================

import React, { useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isAI = message.role === 'ai';
  const [copied, setCopied] = useState(false);

  // Copy response text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        flexDirection: isAI ? 'row' : 'row-reverse',
        animation: 'slideUp 0.25s ease',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: isAI ? 'var(--primary-100)' : 'var(--secondary-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isAI
          ? <Bot size={18} color="var(--primary-600)" />
          : <User size={18} color="#fff" />
        }
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Sender label */}
        <span
          style={{
            fontSize: '0.72rem', fontWeight: 600,
            color: 'var(--gray-500)',
            textAlign: isAI ? 'left' : 'right',
          }}
        >
          {isAI ? 'StudyAI' : 'You'} · {message.time}
        </span>

        {/* Message text box */}
        <div
          style={{
            background: isAI ? '#fff' : 'var(--primary-600)',
            color: isAI ? 'var(--gray-800)' : '#fff',
            border: isAI ? '1px solid var(--gray-200)' : 'none',
            borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
            padding: '12px 16px',
            fontSize: '0.9rem',
            lineHeight: 1.65,
            boxShadow: 'var(--shadow-sm)',
            whiteSpace: 'pre-line',   // respect \n in text
          }}
        >
          {/* Render bold (**text**) in AI messages simply */}
          {isAI ? renderFormatted(message.text) : message.text}
        </div>

        {/* Code block (only for AI messages that have code) */}
        {isAI && message.code && (
          <pre
            style={{
              background: 'var(--gray-900)',
              color: '#e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              fontSize: '0.82rem',
              overflowX: 'auto',
              lineHeight: 1.7,
              border: '1px solid var(--gray-700)',
              fontFamily: "'Fira Code', 'Courier New', monospace",
            }}
          >
            {message.code}
          </pre>
        )}

        {/* Copy button for AI messages */}
        {isAI && (
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              alignSelf: 'flex-start',
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: 'var(--gray-100)', border: 'none',
              fontSize: '0.72rem', color: 'var(--gray-500)',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
};

// Very simple formatter: turns **bold** into <strong>bold</strong>
const renderFormatted = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

export default ChatMessage;
