import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function PageHeader({
  title,
  icon: Icon,
  subtitle,
  action,
  additionalActions,
  maxWidth = 1280,
}) {
  return (
    <div style={{ maxWidth, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            {Icon && <Icon style={{ color: '#2563eb' }} />}
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {subtitle}
            </Text>
          )}
        </div>
        {(additionalActions || action) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {additionalActions}
            {action}
          </div>
        )}
      </div>
    </div>
  );
}