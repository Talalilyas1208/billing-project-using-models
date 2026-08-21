import React from 'react';

const SidebarBrand = () => (
  <div
    style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 20px',
      borderBottom: '1px solid #1e293b',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0,
      }}
    >
      B
    </div>
    <div>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: '18px' }}>
        billing app
      </div>
      <div style={{ color: '#64748b', fontSize: 10, lineHeight: '14px' }}>
        Accounting Dashboard
      </div>
    </div>
  </div>
);

export default SidebarBrand;