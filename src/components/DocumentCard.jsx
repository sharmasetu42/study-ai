// ============================================================
//  DocumentCard.jsx
//  Displays a single uploaded PDF document with status, actions.
// ============================================================

import React, { useState } from 'react';
import {
  FileText, MoreVertical, ExternalLink,
  MessageSquare, Trash2, Clock
} from 'lucide-react';
import Button from './Button';

// Status badge color mapping
const statusColors = {
  Ready:      { bg: 'var(--success-50)',  text: 'var(--success-600)'  },
  Processing: { bg: 'var(--warning-50)',  text: 'var(--warning-600)'  },
  Error:      { bg: 'var(--error-50)',    text: 'var(--error-600)'    },
};

const DocumentCard = ({ doc, onAskAI, onOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { bg, text } = statusColors[doc.status] || statusColors.Ready;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow var(--transition-fast)',
        position: 'relative',
      }}
      className="doc-card"
    >
      <style>{`.doc-card:hover { box-shadow: var(--shadow-md); }`}</style>

      {/* PDF icon */}
      <div
        style={{
          width: 44, height: 44,
          background: 'var(--error-50)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <FileText size={22} color="var(--error-500)" />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 600, fontSize: '0.9rem',
            color: 'var(--gray-800)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          {doc.name}
        </p>

        <div
          style={{
            display: 'flex', flexWrap: 'wrap',
            gap: '10px', marginTop: 4, alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
            {doc.pages} pages
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>•</span>
          <span
            style={{
              display: 'flex', alignItems: 'center',
              gap: 3, fontSize: '0.78rem', color: 'var(--gray-500)',
            }}
          >
            <Clock size={11} /> {doc.uploadedAt}
          </span>

          {/* Status badge */}
          <span
            style={{
              fontSize: '0.7rem', fontWeight: 600,
              padding: '2px 8px', borderRadius: 'var(--radius-full)',
              background: bg, color: text,
            }}
          >
            {doc.status}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <Button
            size="sm"
            variant="outline"
            icon={<ExternalLink size={13} />}
            onClick={() => onOpen && onOpen(doc)}
          >
            Open
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<MessageSquare size={13} />}
            onClick={() => onAskAI && onAskAI(doc)}
            disabled={doc.status !== 'Ready'}
          >
            Ask AI
          </Button>
        </div>
      </div>

      {/* Three-dot menu */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            width: 30, height: 30,
            borderRadius: 'var(--radius-sm)',
            background: menuOpen ? 'var(--gray-100)' : 'transparent',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gray-500)',
            transition: 'background var(--transition-fast)',
          }}
          aria-label="Document options"
        >
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <div
            style={{
              position: 'absolute', right: 0, top: 34,
              background: '#fff',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 10,
              minWidth: 140,
              overflow: 'hidden',
            }}
          >
            {[
              { label: 'Open', icon: <ExternalLink size={13} /> },
              { label: 'Delete', icon: <Trash2 size={13} />, danger: true },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '9px 14px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: item.danger ? 'var(--error-500)' : 'var(--gray-700)',
                  transition: 'background var(--transition-fast)',
                }}
                className="menu-item"
              >
                {item.icon} {item.label}
              </button>
            ))}
            <style>{`.menu-item:hover { background: var(--gray-50); }`}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
