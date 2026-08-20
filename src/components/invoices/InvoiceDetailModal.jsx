import React from 'react';
import {
  Modal,
  Descriptions,
  Table,
  Typography,
  Button,
  Space,
  Divider,
} from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import Badge from '../common/Badge';

const { Title, Text } = Typography;

const InvoiceDetailModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const invoiceSubtotal  = Number(invoice.subtotal ?? 0) || 0;
  const invoiceTaxTotal  = Number(invoice.taxTotal ?? invoice.vatAmount ?? 0) || 0;
  const invoiceGrandTotal = Number(invoice.grandTotal ?? invoice.amount ?? 0) || 0;

  const lineItemColumns = [
    {
      title: 'Item / Service',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 60,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      width: 100,
      render: (val) => `$${Number(val).toFixed(2)}`,
    },
    {
      title: 'Tax Rate',
      dataIndex: 'taxRate',
      key: 'taxRate',
      align: 'right',
      width: 80,
      render: (val) => `${val}%`,
    },
    {
      title: 'Amount',
      key: 'amount',
      align: 'right',
      width: 100,
      render: (_, record) =>
        <Text strong>${(record.quantity * record.unitPrice).toFixed(2)}</Text>,
    },
  ];

  return (
    <Modal
      open={!!invoice}
      onCancel={onClose}
      footer={
        <Space>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            Print PDF
          </Button>
          <Button type="primary" onClick={onClose}>
            Close
          </Button>
        </Space>
      }
      width={700}
      title={
        <Space>
          <Text strong>{invoice.id}</Text>
          <Badge status={invoice.status} />
        </Space>
      }
      destroyOnHidden
    >
      {/* Company + Invoice Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            B
          </div>
          <Text strong style={{ display: 'block' }}>Billy.dk Solutions A/S</Text>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            Østergade 12, 1100 København K
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            CVR: 34901234 • support@billy.dk
          </Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>
            INVOICE
          </Text>
          <Text strong style={{ fontSize: 20, color: '#2563eb', display: 'block' }}>
            {invoice.id}
          </Text>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 6 }}>
            <strong>Issue Date:</strong> {invoice.issueDate}
          </Text>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            <strong>Due Date:</strong> {invoice.dueDate}
          </Text>
        </div>
      </div>

      {/* Billed To */}
      <Descriptions
        bordered
        size="small"
        column={1}
        style={{ marginBottom: 20 }}
      >
        <Descriptions.Item label="Billed To">
          <Text strong>{invoice.customerName}</Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
            {invoice.customerEmail}
          </Text>
        </Descriptions.Item>
      </Descriptions>

      {/* Line Items */}
      <Table
        dataSource={invoice.items || []}
        columns={lineItemColumns}
        rowKey={(_, i) => i}
        pagination={false}
        size="small"
        style={{ marginBottom: 16 }}
      />

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748b', fontSize: 13 }}>
            <span>Subtotal:</span>
            <Text strong>${invoiceSubtotal.toFixed(2)}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748b', fontSize: 13 }}>
            <span>VAT / Tax Total:</span>
            <Text strong>${invoiceTaxTotal.toFixed(2)}</Text>
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 15 }}>
            <Text strong>Grand Total:</Text>
            <Text strong style={{ color: '#2563eb', fontSize: 16 }}>
              ${invoiceGrandTotal.toFixed(2)}
            </Text>
          </div>
        </div>
      </div>

      {/* Attachment */}
      {invoice.attachment && (
        <>
          <Divider />
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space>
              <PaperClipOutlined style={{ color: '#2563eb' }} />
              <Text strong style={{ color: '#1e40af', fontSize: 12 }}>
                Attached File: {invoice.attachment}
              </Text>
            </Space>
            <Button size="small" icon={<DownloadOutlined />}>
              Download
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default InvoiceDetailModal;
