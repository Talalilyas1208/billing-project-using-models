import React, { useState } from 'react';
import { Space, Typography, Form } from 'antd';
import Button from '../components/common/Button';
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
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/layout/PageHeader';
import DataTable from '../components/table/DataTable';
import { normalizeApiResponse } from '../utils/apiNormalization';

const { Text } = Typography;

const CustomerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const {
    data: response = {},
    isLoading,
    refetch: refetchCustomers,
  } = useGetCustomersQuery({ page: 1, limit: 10 });

  const customers = normalizeApiResponse(response);

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
        <Badge status={record.status || 'Active'} />
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <PageHeader
        title="Customer Directory"
        icon={TeamOutlined}
        subtitle="Manage your client profiles, billing emails, and customer directory"
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            Create Customer
          </Button>
        }
      />
      <Modals
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Customer"
        width={700}
        footer={null}
      >
        <NewCustomers
          refetchCustomers={refetchCustomers}
          onClose={handleCloseModal}
          form={form}
        />
      </Modals>

      {/* Customers Table */}
      <DataTable
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
            <EmptyState
              icon={TeamOutlined}
              title="No customers found"
              description="You haven't added any customers yet."
              action={
                <Button
                  type="primary"
                  size="small"
                  icon={<UserAddOutlined />}
                  onClick={handleOpenModal}
                >
                  Create First Customer
                </Button>
              }
            />
          ),
        }}
      />
    </div>
  );
};

export default CustomerPage;
