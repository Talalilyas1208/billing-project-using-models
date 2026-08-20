import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Table,
  InputNumber,
  Space,
  Typography,
  Divider,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAddInvoiceMutation } from '../../redux/api/invoicesApi';

const { Text } = Typography;

const prebuiltCustomers = [
  { name: 'Acme Corporation', email: 'billing@acme.com' },
  { name: 'Nordic Tech Solutions AB', email: 'accounts@nordictech.se' },
  { name: 'Copenhagen Design House', email: 'finance@cphdesign.dk' },
  { name: 'Aarhus Software Group', email: 'invoices@aarhussoft.dk' },
];

const CreateInvoiceModal = ({ isOpen, onClose }) => {
  const [addInvoice, { isLoading }] = useAddInvoiceMutation();
  const [form] = Form.useForm();

  const [items, setItems] = useState([
    { id: 1, description: 'Software Consulting Service', quantity: 1, unitPrice: 1500, taxRate: 25 },
  ]);
  const [attachment, setAttachment] = useState(null);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: '', quantity: 1, unitPrice: 0, taxRate: 25 },
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const val = field === 'description' ? value : Number(value);
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0);
  const taxTotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0) * ((item.taxRate || 0) / 100),
    0
  );
  const grandTotal = subtotal + taxTotal;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newInvoice = {
        id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        issueDate: values.issueDate,
        dueDate: values.dueDate,
        status: 'Pending',
        items,
        subtotal,
        taxTotal,
        grandTotal,
        attachment,
      };

      await addInvoice(newInvoice);
      form.resetFields();
      onClose();
    } catch (e) {
      console.error('Validation / creation failed:', e);
    }
  };

  const lineItemColumns = [
    {
      title: 'Description',
      key: 'description',
      render: (_, record) => (
        <Input
          placeholder="Service or product description..."
          value={record.description}
          onChange={(e) => handleItemChange(record.id, 'description', e.target.value)}
          size="small"
        />
      ),
    },
    {
      title: 'Qty',
      key: 'quantity',
      width: 80,
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(v) => handleItemChange(record.id, 'quantity', v)}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Price ($)',
      key: 'unitPrice',
      width: 110,
      render: (_, record) => (
        <InputNumber
          min={0}
          precision={2}
          value={record.unitPrice}
          onChange={(v) => handleItemChange(record.id, 'unitPrice', v)}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Tax %',
      key: 'taxRate',
      width: 80,
      render: (_, record) => (
        <InputNumber
          min={0}
          value={record.taxRate}
          onChange={(v) => handleItemChange(record.id, 'taxRate', v)}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: 90,
      align: 'right',
      render: (_, record) => (
        <Text strong>${((record.quantity || 0) * (record.unitPrice || 0)).toFixed(2)}</Text>
      ),
    },
    {
      title: '',
      key: 'del',
      width: 40,
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
        />
      ),
    },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={720}
      title={
        <Space>
          <div
            style={{
              padding: 6,
              background: '#2563eb',
              borderRadius: 6,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FileTextOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>New Billy.dk Invoice</div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>
              INV-2026-004 (Auto-generated)
            </div>
          </div>
        </Space>
      }
      footer={
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="primary"
            loading={isLoading}
            icon={<CheckCircleOutlined />}
            onClick={handleSubmit}
          >
            Save &amp; Create Invoice
          </Button>
        </Space>
      }
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          customerName: prebuiltCustomers[0].name,
          customerEmail: prebuiltCustomers[0].email,
          issueDate: '2026-08-13',
          dueDate: '2026-08-27',
        }}
        requiredMark={false}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: 'Please select customer' }]}
            style={{ margin: 0 }}
          >
            <Select
              options={prebuiltCustomers.map((c) => ({ value: c.name, label: c.name }))}
              onChange={(name) => {
                const found = prebuiltCustomers.find((c) => c.name === name);
                if (found) form.setFieldsValue({ customerEmail: found.email });
              }}
            />
          </Form.Item>

          <Form.Item
            name="customerEmail"
            label="Customer Email"
            rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="customer@billing.com" />
          </Form.Item>

          <Form.Item
            name="issueDate"
            label="Issue Date"
            rules={[{ required: true }]}
            style={{ margin: 0 }}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Payment Due Date"
            rules={[{ required: true }]}
            style={{ margin: 0 }}
          >
            <Input type="date" />
          </Form.Item>
        </div>

        {/* Line Items */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Invoice Line Items
            </Text>
            <Button size="small" icon={<PlusOutlined />} onClick={handleAddItem}>
              Add Row
            </Button>
          </div>
          <Table
            dataSource={items}
            columns={lineItemColumns}
            rowKey="id"
            pagination={false}
            size="small"
            bordered
          />
        </div>

        {/* Attachment + Totals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Text style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Attachment / Contract (Optional)
            </Text>
            <Upload
              beforeUpload={(file) => {
                setAttachment(file.name);
                return false;
              }}
              maxCount={1}
              showUploadList={!!attachment}
            >
              <Button icon={<UploadOutlined />} block>
                {attachment ? attachment : 'Click to upload invoice PDF or Image'}
              </Button>
            </Upload>
            <Text type="secondary" style={{ fontSize: 10, display: 'block', marginTop: 4 }}>
              Supports PDF, PNG, JPG up to 10MB
            </Text>
          </div>

          <div
            style={{
              background: '#f8fafc',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              padding: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 13, marginBottom: 4 }}>
              <span>Subtotal:</span>
              <Text strong>${subtotal.toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 13, marginBottom: 4 }}>
              <span>VAT / Tax (25%):</span>
              <Text strong>${taxTotal.toFixed(2)}</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <Text strong>Grand Total:</Text>
              <Text strong style={{ color: '#2563eb', fontSize: 15 }}>${grandTotal.toFixed(2)}</Text>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateInvoiceModal;
