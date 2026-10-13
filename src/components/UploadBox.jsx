// ============================================================
//  UploadBox.jsx
//  Drag-and-drop + click-to-browse upload area for PDF files.
//  This is UI-only; actual upload logic connects to backend later.
// ============================================================

import React, { useState, useRef } from 'react';
import { CloudUpload, FileText } from 'lucide-react';
import Button from './Button';

const UploadBox = ({ onFileSelect }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef();

  // ── Drag events ────────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileSelect && onFileSelect(file);
    }
  };

  // ── File input change ──────────────────────────────────────
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect && onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
      style={{
        border: `2px dashed ${dragging ? 'var(--primary-400)' : 'var(--gray-300)'}`,
        borderRadius: 'var(--radius-xl)',
        background: dragging ? 'var(--primary-50)' : 'var(--gray-50)',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        textAlign: 'center',
        minHeight: 180,
      }}
    >
      {/* Hidden real file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()} // prevent double trigger
      />

      {/* Icon */}
      <div
        style={{
          width: 60, height: 60,
          background: dragging ? 'var(--primary-100)' : '#fff',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-md)',
          transition: 'all var(--transition-fast)',
        }}
      >
        {selectedFile
          ? <FileText size={28} color="var(--error-500)" />
          : <CloudUpload size={28} color="var(--primary-500)" />
        }
      </div>

      {selectedFile ? (
        <>
          <p style={{ fontWeight: 600, color: 'var(--gray-800)', fontSize: '0.95rem' }}>
            {selectedFile.name}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change
          </p>
        </>
      ) : (
        <>
          <p style={{ fontWeight: 600, color: 'var(--gray-700)', fontSize: '0.95rem' }}>
            Drag &amp; drop your PDF here
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>or</p>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
          >
            Browse Files
          </Button>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
            PDF up to 10 MB
          </p>
        </>
      )}
    </div>
  );
};

export default UploadBox;
