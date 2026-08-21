import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      {Icon && <Icon style={{ fontSize: 40, color: '#cbd5e1', marginBottom: 12 }} />}
      <div style={{ fontWeight: 600, color: '#475569' }}>{title}</div>
      {description && (
        <div style={{ color: '#94a3b8', fontSize: 12, margin: '8px 0 16px' }}>
          {description}
        </div>
      )}
      {action}
    </div>
  );
}