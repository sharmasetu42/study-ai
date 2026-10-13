// ============================================================
//  ActivityCard.jsx
//  A single row in the "Recent Activity" list.
// ============================================================

import React from 'react';
import {
  CheckCircle2, BookOpen, Upload, MessageSquare
} from 'lucide-react';

// Map iconName string → actual Lucide component
const iconMap = { CheckCircle2, BookOpen, Upload, MessageSquare };

const ActivityCard = ({ activity }) => {
  const IconComponent = iconMap[activity.iconName] || MessageSquare;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid var(--gray-100)',
      }}
    >
      {/* Icon bubble */}
      <div
        style={{
          width: 36, height: 36,
          borderRadius: 'var(--radius-md)',
          background: `${activity.iconColor}18`, // 10% opacity
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IconComponent size={16} color={activity.iconColor} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 600, fontSize: '0.85rem',
            color: 'var(--gray-800)',
          }}
        >
          {activity.title}
        </p>
        <p
          style={{
            fontSize: '0.78rem', color: 'var(--gray-500)',
            marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          {activity.detail}
        </p>
      </div>

      {/* Timestamp */}
      <span
        style={{
          fontSize: '0.72rem', color: 'var(--gray-400)',
          flexShrink: 0, paddingTop: 2,
        }}
      >
        {activity.time}
      </span>
    </div>
  );
};

export default ActivityCard;
