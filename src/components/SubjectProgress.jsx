// ============================================================
//  SubjectProgress.jsx
//  A single subject row on the Progress page –
//  shows subject name, colored bar, and percentage.
// ============================================================

import React from 'react';
import ProgressBar from './ProgressBar';

const SubjectProgress = ({ subject, percent, color }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-700)' }}>
        {subject}
      </span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>
        {percent}%
      </span>
    </div>
    <ProgressBar percent={percent} color={color} height={8} />
  </div>
);

export default SubjectProgress;
