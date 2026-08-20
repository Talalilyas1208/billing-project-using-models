import React from 'react';
import { Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function InvoiceHeader({ onBack }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
      }}
    >
      <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
        Back
      </Button>
      <div>
        <Title level={4} style={{ margin: 0 }}>
          Create New Invoice
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Fill in invoice details, select customer, and add line items
        </Text>
      </div>
    </div>
  );
}
