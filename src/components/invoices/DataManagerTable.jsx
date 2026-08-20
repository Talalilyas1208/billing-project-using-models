import React, { useState } from 'react';
import { Table, Input, Button, Typography, Space } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useGetCustomersQuery } from '../../redux/api/blackListApi';

const { Text } = Typography;

const DataManagerTable = ({ columns = [], title = 'Customers Table' }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response = {}, isLoading } = useGetCustomersQuery({ page, limit, search });

  const items = response.data || (Array.isArray(response) ? response : []);
  const totalPages = response.totalPages || 1;
  const totalItems = response.total || items.length;

  // Build Ant Design Table columns from passed-in config
  const antColumns = columns.map((col) => ({
    title: col.header,
    dataIndex: col.key,
    key: col.key,
    render: col.render ? (val, row) => col.render(val, row) : (val) => val ?? 'N/A',
  }));

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <Text strong style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569' }}>
          {title} ({totalItems})
        </Text>
        <Input.Search
          placeholder="Search customers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ width: 260 }}
          size="small"
          allowClear
        />
      </div>

      {/* Table */}
      <Table
        dataSource={items}
        columns={antColumns}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        size="small"
      />

      {/* Pagination */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          Page <strong style={{ color: '#1e293b' }}>{page}</strong> of{' '}
          <strong style={{ color: '#1e293b' }}>{totalPages}</strong>
        </Text>
        <Space>
          <Button
            size="small"
            icon={<LeftOutlined />}
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          />
          <Button
            size="small"
            icon={<RightOutlined />}
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          />
        </Space>
      </div>
    </div>
  );
};

export default DataManagerTable;
