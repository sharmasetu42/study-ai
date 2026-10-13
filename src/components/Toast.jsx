// ============================================================
//  Toast.jsx + useToast hook
//  Lightweight toast notification system.
//  Usage (in any component):
//    import { useToast } from './Toast';
//    const { showToast, ToastContainer } = useToast();
//    showToast('File uploaded!', 'success');
//    <ToastContainer />
// ============================================================

import React, { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast; auto-remove after 3 seconds
  const showToast = useCallback((message, type = 'default') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const iconMap = {
    success: <CheckCircle2 size={16} />,
    error:   <XCircle size={16} />,
    warning: <AlertCircle size={16} />,
    default: <Info size={16} />,
  };

  const bgMap = {
    success: 'var(--success-600)',
    error:   'var(--error-600)',
    warning: 'var(--warning-600)',
    default: 'var(--gray-800)',
  };

  // Render all active toasts
  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          style={{ background: bgMap[t.type] || bgMap.default }}
        >
          {iconMap[t.type] || iconMap.default}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            style={{
              background: 'none', border: 'none', color: '#fff',
              cursor: 'pointer', padding: 0, display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};
