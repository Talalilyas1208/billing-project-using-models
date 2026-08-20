import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const statConfig = [
  {
    key: 'total',
    title: 'Total Invoiced',
    icon: <DollarOutlined />,
    iconColor: '#2563eb',
    iconBg: '#eff6ff',
    filter: () => true,
  },
  {
    key: 'paid',
    title: 'Paid Revenue',
    icon: <CheckCircleOutlined />,
    iconColor: '#059669',
    iconBg: '#f0fdf4',
    filter: (inv) => inv.status === 'Paid',
  },
  {
    key: 'pending',
    title: 'Pending Amount',
    icon: <ClockCircleOutlined />,
    iconColor: '#d97706',
    iconBg: '#fffbeb',
    filter: (inv) => inv.status === 'Pending',
  },
  {
    key: 'overdue',
    title: 'Overdue Amount',
    icon: <WarningOutlined />,
    iconColor: '#e11d48',
    iconBg: '#fff1f2',
    filter: (inv) => inv.status === 'Overdue',
  },
];

const getTotal = (inv) => Number(inv.amount ?? inv.grandTotal ?? 0) || 0;

const InvoiceStats = React.memo(({ invoices = [] }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {statConfig.map((cfg) => {
        const filtered = invoices.filter(cfg.filter);
        const amount = filtered.reduce((acc, inv) => acc + getTotal(inv), 0);

        return (
          <Col key={cfg.key} xs={24} sm={12} lg={6}>
            <Card
              style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
              styles={{ body: { padding: '20px 20px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 4,
                    }}
                  >
                    {cfg.title}
                  </div>
                  <Statistic
                    value={amount}
                    precision={2}
                    prefix="$"
                    valueStyle={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: '28px' }}
                  />
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    {filtered.length} invoice{filtered.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: cfg.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: cfg.iconColor,
                    flexShrink: 0,
                  }}
                >
                  {cfg.icon}
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
});

InvoiceStats.displayName = 'InvoiceStats';

export default InvoiceStats;
