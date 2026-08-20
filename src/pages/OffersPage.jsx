import React, { useMemo } from 'react';
import { Table, Button, Typography, Tag } from 'antd';
import { FileDoneOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetProductsQuery } from '../redux/api/blackListApi';

const { Title, Text } = Typography;

const OffersPage = () => {
  const { data: response = {}, isLoading } = useGetProductsQuery({ page: 1, limit: 10 });
  const products = Array.isArray(response) ? response : response.data || [];

  const offers = useMemo(
    () =>
      products.map((p, index) => ({
        id: `OFF-2026-10${index + 1}`,
        customer: p.supplier !== '12' ? p.supplier : 'Acme Corporation',
        title: p.description !== '12' ? p.description : 'Enterprise Solution Package',
        total: Number(p.price || 0) * 1.5,
        validUntil: '2026-09-15',
        status: index % 2 === 0 ? 'Accepted' : 'Sent',
        currency: p.currency || 'USD',
      })),
    [products]
  );

  const columns = [
    {
      title: 'Offer ID',
      dataIndex: 'id',
      key: 'id',
      render: (val) => (
        <Text strong style={{ color: '#2563eb' }}>
          {val}
        </Text>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (val) => <Text strong>{val}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'title',
      key: 'title',
      render: (val) => <Text type="secondary">{val}</Text>,
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (val) => <Text type="secondary">{val}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => (
        <Tag
          color={val === 'Accepted' ? 'success' : 'processing'}
          style={{ borderRadius: 20, fontWeight: 600, fontSize: 11 }}
        >
          {val}
        </Tag>
      ),
    },
    {
      title: 'Total Amount',
      key: 'total',
      align: 'right',
      render: (_, record) => (
        <Text strong>
          ${record.total.toFixed(2)} ({record.currency})
        </Text>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileDoneOutlined style={{ color: '#2563eb' }} />
            Quotations &amp; Offers
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Dynamic offer data loaded via RTK Query API
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          New Quotation
        </Button>
      </div>

      {/* Offers Table */}
      <Table
        dataSource={offers}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        size="middle"
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default OffersPage;
