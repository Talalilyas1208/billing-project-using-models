import React, { useState, useMemo, useCallback } from 'react';
import {
  Form,
  Select,
  Table,
  InputNumber,
  Space,
  Typography,
  Alert,
  Divider,
  Upload,
} from 'antd';
import Input from '../components/common/Input';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Modals from '../components/Modal';
import Button from '../components/common/Button';
import CardComponent from '../components/CardComponent';
import Config from '../components/Config';
import NewCustomers from '../components/NewCustomers/NewCustomers';
import ManageProductForm from '../components/products/ManageProductForm';
import InvoiceHeader from '../components/NewInvoice/InvoiceHeader';
import {
  useGetCurrenciesQuery,
  useGetPaymentDeadlinesQuery,
  useGetVatQuery,
  useGetapprovebuttonQuery,
  useGetFieldTypeOptionsQuery,
  useAddInvoiceMutation,
} from '../redux/api/api';
import { useGetCustomersQuery, useGetProductsQuery } from '../redux/api/blackListApi';

const { Text } = Typography;

export default function Newinvoice() {
  const navigate = useNavigate();
  const [addInvoice, { isLoading: isSubmitting }] = useAddInvoiceMutation();
  const [form] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [productForm] = Form.useForm();

  const [isOpen, setIsOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const { data: currenciesRes } = useGetCurrenciesQuery();
  const { data: deadlinesRes } = useGetPaymentDeadlinesQuery();
  const { data: vatRes } = useGetVatQuery();
  const { data: actionButtonsRes } = useGetapprovebuttonQuery();
  const { data: fieldLabels = {} } = useGetFieldTypeOptionsQuery();
  const {
    data: customersResponse,
    isLoading: CustomerLoading,
    refetch: refetchCustomers,
  } = useGetCustomersQuery();
  const {
    data: productsResponse,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useGetProductsQuery({ page: 1, limit: 100 });

  const customersList = Array.isArray(customersResponse?.data)
    ? customersResponse.data
    : Array.isArray(customersResponse)
    ? customersResponse
    : [];

  const productsList = Array.isArray(productsResponse?.data)
    ? productsResponse.data
    : Array.isArray(productsResponse)
    ? productsResponse
    : [];

  const currencyList = Array.isArray(currenciesRes?.data)
    ? currenciesRes.data
    : Array.isArray(currenciesRes)
    ? currenciesRes
    : [];

  const deadlineList = Array.isArray(deadlinesRes?.data)
    ? deadlinesRes.data
    : Array.isArray(deadlinesRes)
    ? deadlinesRes
    : [];

  const vatList = Array.isArray(vatRes?.data)
    ? vatRes.data
    : Array.isArray(vatRes)
    ? vatRes
    : [];

  const approveButtonsList = Array.isArray(actionButtonsRes?.data)
    ? actionButtonsRes.data
    : Array.isArray(actionButtonsRes)
    ? actionButtonsRes
    : [];

  const [items, setItems] = useState([
    { id: 1, description: 'Software Consulting & Architecture', quantity: 1, unitPrice: 1800, taxRate: 25 },
  ]);
  const [attachment, setAttachment] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const handleAddItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: '', quantity: 1, unitPrice: 0, taxRate: 25 },
    ]);
  }, []);

  const handleRemoveItem = useCallback((id) => {
    setItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const handleItemChange = useCallback((id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const val = field === 'description' ? value : Number(value);
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  }, []);

  const { subtotal, taxTotal, grandTotal } = useMemo(() => {
    const sub = items.reduce((s, i) => s + (i.quantity || 0) * (i.unitPrice || 0), 0);
    const tax = items.reduce((s, i) => s + (i.quantity || 0) * (i.unitPrice || 0) * ((i.taxRate || 0) / 100), 0);
    return { subtotal: sub, taxTotal: tax, grandTotal: sub + tax };
  }, [items]);

  const handleBack = useCallback(() => {
    navigate('/dashboard/invoices');
  }, [navigate]);

  const handleOpenCreateCustomer = useCallback(() => setIsOpen(true), []);
  const handleCloseCreateCustomer = useCallback(() => {
    setIsOpen(false);
    if (refetchCustomers) refetchCustomers();
  }, [refetchCustomers]);

  const handleOpenCreateProduct = useCallback(() => setIsProductModalOpen(true), []);
  const handleCloseCreateProduct = useCallback(() => {
    setIsProductModalOpen(false);
    if (refetchProducts) refetchProducts();
  }, [refetchProducts]);

  const handleProductSelect = useCallback((id, productId) => {
    const product = productsList.find((p) => String(p.id) === String(productId));
    if (!product) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              productId,
              description: product.productname || product.name || item.description,
              unitPrice: Number(product.price || 0),
            }
          : item
      )
    );
  }, [productsList]);

  const handleFormSubmit = async (actionLabel = 'Approve & Save') => {
    setSubmitError('');
    try {
      const values = await form.validateFields();
      const customerName = values.customerSelect || values.customerEmail?.split('@')[0] || '';
      const customerEmail = values.customerEmail || '';
      const found = customersList.find((c) => (c.name || c.Company_name) === customerName);

      const payload = {
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        client: customerName,
        customerEmail: found?.email || customerEmail,
        amount: grandTotal,
        subtotal,
        vatAmount: taxTotal,
        currency: values.currency || 'USD',
        status: values.status || 'Pending',
        date: values.issueDate,
        dueDate: values.dueDate,
        vatOption: values.vat,
        paymentDeadline: values.paymentDeadline,
        items,
        attachment,
        actionTaken: actionLabel,
        createdAt: new Date().toISOString(),
      };

      await addInvoice(payload).unwrap();
      form.resetFields();
      navigate('/dashboard/invoices');
    } catch (err) {
      if (err?.errorFields) return; // validation error — antd handles it
      console.error('Failed to post invoice:', err);
      setSubmitError('Failed to save invoice. Please try again.');
    }
  };

  const hasCustomers = customersList.length > 0;

  const lineItemColumns = [
    {
      title: 'Product / Service',
      key: 'description',
      render: (_, record) => (
        <Select
          placeholder="Select product..."
          value={record.productId}
          onChange={(v) => handleProductSelect(record.id, v)}
          options={productOptions}
          loading={productsLoading}
          showSearch
          optionFilterProp="label"
          size="small"
          style={{ width: '100%' }}
          notFoundContent={
            <Button type="link" size="small" onClick={handleOpenCreateProduct} style={{ padding: 0 }}>
              + Add Product
            </Button>
          }
        />
      ),
    },
    {
      title: 'Description',
      key: 'descriptionText',
      render: (_, record) => (
        <Input
          placeholder="Service description..."
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
      title: 'Price',
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

  const currencyOptions = useMemo(
    () =>
      currencyList.map((c) => ({
        value: c.code,
        label: `${c.symbol ? c.symbol + ' ' : ''}${c.name || c.code} (${c.code})`,
      })),
    [currencyList]
  );

  const deadlineOptions = useMemo(
    () =>
      deadlineList.map((pd, idx) => ({
        value: String(pd.days !== undefined ? pd.days : pd.value || pd.id || idx),
        label: pd.label || `${pd.days || 0} days after`,
      })),
    [deadlineList]
  );

  const vatOptions = useMemo(
    () =>
      vatList.map((v, idx) => ({
        value: String(v.key || v.code || v.id || idx),
        label: `${v.code || v.label || 'VAT Option'}${v.description ? ` (${v.description})` : ''}`,
      })),
    [vatList]
  );

  const customerOptions = useMemo(
    () =>
      customersList.map((c) => ({
        value: c.name || c.Company_name,
        label: `${c.Company_name || c.name} (${c.email || 'N/A'})`,
      })),
    [customersList]
  );

  const productOptions = useMemo(
    () =>
      productsList.map((p) => ({
        value: p.id,
        label: `${p.productname || p.name} - $${Number(p.price || 0).toFixed(2)}`,
      })),
    [productsList]
  );

  return (
    <Config>
      <InvoiceHeader onBack={handleBack} />

      <Modals
        isOpen={isOpen}
        onClose={handleCloseCreateCustomer}
        title="Create New Customer"
        footer={null}
      >
        <NewCustomers
          refetchCustomers={refetchCustomers}
          onClose={handleCloseCreateCustomer}
          form={customerForm}
        />
      </Modals>

      <Modals
        isOpen={isProductModalOpen}
        onClose={handleCloseCreateProduct}
        title="Add New Product"
        width={800}
        footer={null}
      >
        <ManageProductForm
          form={productForm}
          onClose={handleCloseCreateProduct}
          refetchProducts={refetchProducts}
        />
      </Modals>

      <CardComponent
        style={{
          width: '100%',
          borderRadius: '10px',
          borderColor: '#b9adadff',
        }}
      >
        {submitError && (
          <Alert message={submitError} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Form form={form} layout="vertical" requiredMark={false}>
          {/* Configuration Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              padding: 12,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Form.Item name="currency" label={fieldLabels.currency || 'Currency'} style={{ margin: 0 }}>
              <Select options={currencyOptions} placeholder="Currency" size="small" />
            </Form.Item>
            <Form.Item name="paymentDeadline" label={fieldLabels.paymentTerms || 'Payment Deadline'} style={{ margin: 0 }}>
              <Select options={deadlineOptions} placeholder="Deadline" size="small" />
            </Form.Item>
            <Form.Item name="vat" label="VAT Option" style={{ margin: 0 }}>
              <Select options={vatOptions} placeholder="VAT" size="small" />
            </Form.Item>
            <Form.Item name="status" label="Initial Status" initialValue="Pending" style={{ margin: 0 }}>
              <Select size="small">
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Paid">Paid Receipt</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* Customer & Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="customerSelect"
              label={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>Select Customer</span>
                  {hasCustomers && (
                    <Button type="link" size="small" onClick={handleOpenCreateCustomer} style={{ padding: 0, fontSize: 11 }}>
                      + Create New
                    </Button>
                  )}
                </Space>
              }
              rules={[{ required: true, message: 'Please select a customer' }]}
              style={{ margin: 0 }}
            >
              {hasCustomers ? (
                <Select
                  options={customerOptions}
                  placeholder="-- Choose Customer --"
                  showSearch
                  loading={CustomerLoading}
                />
              ) : (
                <div
                  style={{
                    border: '1px dashed #cbd5e1',
                    borderRadius: 8,
                    padding: 12,
                    background: '#f8fafc',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>No customers found</div>
                  <Button
                    type="primary"
                    size="small"
                    icon={<UserAddOutlined />}
                    onClick={handleOpenCreateCustomer}
                    block
                  >
                    Create Customer
                  </Button>
                </div>
              )}
            </Form.Item>

            <Form.Item
              name="customerEmail"
              label="Customer Email"
              rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
              style={{ margin: 0 }}
            >
              <Input placeholder="customer@billing.com" />
            </Form.Item>

            <Form.Item name="issueDate" label="Issue Date" rules={[{ required: true }]} style={{ margin: 0 }}>
              <Input type="date" />
            </Form.Item>

            <Form.Item name="dueDate" label="Payment Due Date" rules={[{ required: true }]} style={{ margin: 0 }}>
              <Input type="date" />
            </Form.Item>
          </div>

          {/* Line Items */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Line Items
              </Text>
              <Space size="small">
                <Button size="small" icon={<UserAddOutlined />} onClick={handleOpenCreateProduct}>
                  Add Product
                </Button>
                <Button size="small" icon={<PlusOutlined />} onClick={handleAddItem}>
                  Add Line Item
                </Button>
              </Space>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <Text style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Attachment PDF / Image
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
                  {attachment ? attachment : 'Click to attach file'}
                </Button>
              </Upload>
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

          {/* Actions */}
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleBack} disabled={isSubmitting}>
              Cancel
            </Button>
            {approveButtonsList.length > 0 ? (
              approveButtonsList.map((btn) => (
                <Button
                  key={btn.id || btn.label}
                  type={btn.id === 3 ? 'primary' : 'default'}
                  loading={isSubmitting}
                  icon={btn.id === 3 ? <CheckCircleOutlined /> : undefined}
                  onClick={() => handleFormSubmit(btn.label)}
                >
                  {btn.label}
                </Button>
              ))
            ) : (
              <Button
                type="primary"
                loading={isSubmitting}
                icon={<CheckCircleOutlined />}
                onClick={() => handleFormSubmit('Approve & Save')}
              >
                Approve &amp; Save Invoice
              </Button>
            )}
          </Space>
        </Form>
      </CardComponent>
    </Config>
  );
}
