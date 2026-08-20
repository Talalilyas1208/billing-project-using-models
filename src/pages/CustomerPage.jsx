import React, { useState } from 'react';
import { Table, Button, Space, Typography, Tag, Modal, Form } from 'antd';
import {
  TeamOutlined,
  PlusOutlined,
  UserAddOutlined,
  MailOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useGetCustomersQuery } from '../redux/api/blackListApi';
import Modals from '../components/Modal';
import NewCustomers from '../components/NewCustomers/NewCustomers';

const { Title, Text } = Typography;

const CustomerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const {
    data: response = {},
    isLoading,
    refetch: refetchCustomers,
  } = useGetCustomersQuery({ page: 1, limit: 10 });

  const customers = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : [];

  const handleOpenModal  = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (refetchCustomers) refetchCustomers();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 130,
      render: (val) => (
        <Text strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>
          {String(val).slice(0, 8)}...
        </Text>
      ),
    },
    {
      title: 'Company Name',
      key: 'company',
      render: (_, record) => (
        <Space>
          <BankOutlined style={{ color: '#94a3b8' }} />
          <Text strong>{record.Company_name || record.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Billing Email',
      dataIndex: 'email',
      key: 'email',
      render: (val) => (
        <Space>
          <MailOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
          <Text>{val}</Text>
        </Space>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (val) => <Text type="secondary">{val || 'N/A'}</Text>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color="success" style={{ borderRadius: 20, fontWeight: 600 }}>
          {record.status || 'Active'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* Page Header */}
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
            <TeamOutlined style={{ color: '#2563eb' }} />
            Customer Directory
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Manage your client profiles, billing emails, and customer directory
          </Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          Create Customer
        </Button>
      </div>

      {/* Create Customer Modal */}
      <Modals
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        rest={{ title: 'Create New Customer', width: 700, destroyOnClose: true }}
      >
        <NewCustomers
          refetchCustomers={refetchCustomers}
          onClose={handleCloseModal}
          form={form}
        />
      </Modals>

      {/* Customers Table */}
      <Table
        dataSource={customers}
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
        pagination={{ pageSize: 10, showSizeChanger: true }}
        locale={{
          emptyText: (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <TeamOutlined style={{ fontSize: 40, color: '#cbd5e1', marginBottom: 12 }} />
              <div style={{ fontWeight: 600, color: '#475569' }}>No customers found</div>
              <div style={{ color: '#94a3b8', fontSize: 12, margin: '8px 0 16px' }}>
                You haven't added any customers yet.
              </div>
              <Button
                type="primary"
                size="small"
                icon={<UserAddOutlined />}
                onClick={handleOpenModal}
              >
                Create First Customer
              </Button>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default CustomerPage;
