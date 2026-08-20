import React, { useState } from 'react';
import { Table, Input, Select, Button, Space, Typography, Tooltip } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import Badge from '../common/Badge';

const { Text } = Typography;

const InvoiceTable = ({ invoices = [], onViewInvoice, onDeleteInvoice, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Invoice ID',
      key: 'id',
      render: (_, record) => (
        <Space>
          <Text strong style={{ color: '#2563eb' }}>{record.id}</Text>
          {record.attachment && (
            <Tooltip title={record.attachment}>
              <PaperClipOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 12 }}>{record.customerName}</Text>
          <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{record.customerEmail}</Text>
        </div>
      ),
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (val) => <Text type="secondary">{val}</Text>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (val) => <Text type="secondary">{val}</Text>,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <Text strong>${Number(record.grandTotal || 0).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => <Badge status={record.status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewInvoice(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Invoice">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteInvoice(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
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
        <Input.Search
          placeholder="Filter by invoice ID or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
          size="small"
          allowClear
        />
        <Space>
          <FilterOutlined style={{ color: '#94a3b8' }} />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            size="small"
            style={{ width: 130 }}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
        </Space>
      </div>

      {/* Table */}
      <Table
        dataSource={filteredInvoices}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'No invoices found matching your criteria.' }}
      />
    </div>
  );
};

export default InvoiceTable;
