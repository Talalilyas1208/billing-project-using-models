import React, { useState, useMemo, useCallback } from 'react';
import {
  Space,
  Typography,
  Segmented,
  Form,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import InvoiceStats from '../components/invoices/InvoiceStats';
import InvoiceDetailModal from '../components/invoices/InvoiceDetailModal';
import NewCustomers from '../components/NewCustomers/NewCustomers';
import Modals from '../components/Modal';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/layout/PageHeader';
import DataTable from '../components/table/DataTable';
import { normalizeApiResponse } from '../utils/apiNormalization';
import {
  useGetInvoicesQuery,
  useUpdateInvoiceMutation,
} from '../redux/api/api';

const { Text } = Typography;

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { data: invoicesResponse, refetch, isLoading } = useGetInvoicesQuery();
  const [updateInvoice] = useUpdateInvoiceMutation();

  const invoicesList = normalizeApiResponse(invoicesResponse);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice]   = useState(null);
  const [statusFilter, setStatusFilter]         = useState('All');
  const [customerForm] = Form.useForm();

  const handleCreateInvoice = useCallback(() => navigate('/dashboard/invoices/new'), [navigate]);

  const filteredInvoices = useMemo(
    () =>
      invoicesList.filter((inv) => {
        if (statusFilter === 'All') return true;
        return (inv.status || '').toLowerCase() === statusFilter.toLowerCase();
      }),
    [invoicesList, statusFilter]
  );

  const handleMarkAsPaid = useCallback(
    async (inv) => {
      try {
        await updateInvoice({ id: inv.id, status: 'Paid' }).unwrap();
        if (refetch) refetch();
      } catch (err) {
        console.error('Failed to update invoice status:', err);
      }
    },
    [updateInvoice, refetch]
  );

  const columns = useMemo(
    () => [
      {
        title: 'Invoice ID',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        render: (val, record) => (
          <Text strong style={{ color: '#2563eb' }}>
            {val || record.id}
          </Text>
        ),
      },
      {
        title: 'Client / Customer',
        key: 'client',
        render: (_, record) => (
          <Text strong>{record.client || record.customerName || 'N/A'}</Text>
        ),
      },
      {
        title: 'Issue Date',
        key: 'date',
        render: (_, record) => (
          <Text type="secondary">{record.date || record.issueDate || 'N/A'}</Text>
        ),
      },
      {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (val) => <Text type="secondary">{val || 'N/A'}</Text>,
      },
      {
        title: 'Amount',
        key: 'amount',
        render: (_, record) => {
          const total = Number(record.amount || record.grandTotal || 0);
          return (
            <Text strong>
              ${total.toFixed(2)} ({record.currency || 'USD'})
            </Text>
          );
        },
      },
      {
        title: 'Status',
        key: 'status',
        render: (_, record) => <Badge status={record.status || 'Pending'} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'right',
        render: (_, record) => {
          const isPaid = (record.status || '').toLowerCase() === 'paid';
          return (
            <Space size="small">
              <Tooltip title="View Invoice">
                <Button
                  type="default"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => setSelectedInvoice(record)}
                >
                  View
                </Button>
              </Tooltip>
              {!isPaid && (
                <Tooltip title="Mark as Paid">
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleMarkAsPaid(record)}
                    style={{ background: '#059669', borderColor: '#059669' }}
                  >
                    Mark Paid
                  </Button>
                </Tooltip>
              )}
            </Space>
          );
        },
      },
    ],
    [handleMarkAsPaid]
  );

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <PageHeader
        title="Billing project"
        icon={FileTextOutlined}
        additionalActions={
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Sync API
          </Button>
        }
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateInvoice}>
            Create New Invoice
          </Button>
        }
      />

      {/* KPI Stats */}
      <InvoiceStats invoices={invoicesList} />

      {/* Status Filter */}
      <div style={{ marginBottom: 16 }}>
        <Segmented
          options={['All', 'Pending', 'Paid', 'Approved']}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {/* Table */}
      <DataTable
        dataSource={filteredInvoices}
        columns={columns}
        rowKey={(record) => record.id || record.invoiceNumber}
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
              icon={FileTextOutlined}
              title="No invoices found"
              description={`No invoices matching filter "${statusFilter}"`}
              action={
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={handleCreateInvoice}
                >
                  Create Invoice
                </Button>
              }
            />
          ),
        }}
      />

      {/* Create Customer Modal */}
      <Modals
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Create New Customer"
        footer={null}
      >
        <NewCustomers
          form={customerForm}
          onClose={() => setIsCustomerModalOpen(false)}
        />
      </Modals>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

export default InvoicesPage;
