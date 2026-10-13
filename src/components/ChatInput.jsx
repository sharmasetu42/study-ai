// ============================================================
//  ChatInput.jsx
//  The message composer bar at the bottom of the AI Tutor page.
// ============================================================

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Button from './Button';

const ChatInput = ({ onSend, loading = false, placeholder = 'Ask anything about your notes…' }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setText('');
  };

  // Send on Enter (Shift+Enter = new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end',
        background: '#fff',
        border: '1.5px solid var(--gray-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        transition: 'border-color var(--transition-fast)',
      }}
      className="chat-input-wrapper"
    >
      <style>{`.chat-input-wrapper:focus-within { border-color: var(--primary-400); }`}</style>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: '0.9rem',
          color: 'var(--gray-800)',
          lineHeight: 1.5,
          maxHeight: 120,
          background: 'transparent',
          fontFamily: 'var(--font-body)',
        }}
      />

      <Button
        variant="primary"
        size="sm"
        onClick={handleSend}
        disabled={!text.trim() || loading}
        loading={loading}
        icon={!loading ? <Send size={15} /> : undefined}
        style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px' }}
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
