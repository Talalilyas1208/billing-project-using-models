import React from 'react';
import { Tag } from 'antd';
const statusConfig = {
  Paid:     { color: 'success',  dot: '#10b981' },
  Pending:  { color: 'warning',  dot: '#f59e0b' },
  Overdue:  { color: 'error',    dot: '#f43f5e' },
  Draft:    { color: 'default',  dot: '#94a3b8' },
  Approved: { color: 'processing', dot: '#2563eb' },
  Accepted: { color: 'success',  dot: '#10b981' },
  Sent:     { color: 'blue',     dot: '#3b82f6' },
  Active:   { color: 'success',  dot: '#10b981' },
};

const Badge = React.memo(({ status }) => {
  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <Tag
      color={config.color}
      style={{ borderRadius: 20, fontWeight: 600, fontSize: 11 }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.dot,
          marginRight: 5,
          verticalAlign: 'middle',
        }}
      />
      {status}
    </Tag>
  );
});

Badge.displayName = 'Badge';

export default Badge;
