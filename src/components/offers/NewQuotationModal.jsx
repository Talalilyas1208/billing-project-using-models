import React from 'react';
import { Form, Select, InputNumber, DatePicker } from 'antd';
import dayjs from 'dayjs';
import Modals from '../Modal';
import Input from '../common/Input';
import { useGetCustomersQuery } from '../../redux/api/blackListApi';
import { useGetCurrenciesQuery } from '../../redux/api/api';

const NewQuotationModal = ({ isOpen, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const { data: customersResponse, isLoading: customersLoading } = useGetCustomersQuery();
  const { data: currenciesResponse, isLoading: currenciesLoading } = useGetCurrenciesQuery();

  const customersList = Array.isArray(customersResponse?.data)
    ? customersResponse.data
    : Array.isArray(customersResponse)
    ? customersResponse
    : [];

  const currencyList = Array.isArray(currenciesResponse?.data)
    ? currenciesResponse.data
    : Array.isArray(currenciesResponse)
    ? currenciesResponse
    : [];

  const customerOptions = customersList.map((c) => ({
    value: c.name || c.Company_name,
    label: c.Company_name || c.name,
  }));

  const currencyOptions = currencyList.map((c) => ({
    value: c.code,
    label: `${c.symbol ? c.symbol + ' ' : ''}${c.code}`,
  }));

  const handleOk = async () => {
    const values = await form.validateFields();
    const quotation = {
      id: `OFF-${Date.now().toString().slice(-6)}`,
      customer: values.customer,
      title: values.title,
      total: Number(values.total || 0),
      currency: values.currency || 'USD',
      validUntil: values.validUntil.format('YYYY-MM-DD'),
      status: values.status || 'Sent',
    };
    onCreate(quotation);
    form.resetFields();
  };

  return (
    <Modals
      title="New Quotation"
      isOpen={isOpen}
      onClose={onClose}
      onOk={handleOk}
      okText="Create Quotation"
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="customer"
          label="Customer"
          rules={[{ required: true, message: 'Please select a customer' }]}
        >
          <Select
            options={customerOptions}
            loading={customersLoading}
            placeholder="-- Choose Customer --"
            showSearch
          />
        </Form.Item>

        <Form.Item
          name="title"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input placeholder="Enterprise Solution Package" />
        </Form.Item>

        <Form.Item
          name="total"
          label="Total Amount"
          rules={[{ required: true, message: 'Please enter a total amount' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="currency" label="Currency" initialValue="USD">
          <Select options={currencyOptions} loading={currenciesLoading} />
        </Form.Item>

        <Form.Item
          name="validUntil"
          label="Valid Until"
          initialValue={dayjs().add(30, 'day')}
          rules={[{ required: true, message: 'Please pick a valid until date' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item name="status" label="Status" initialValue="Sent">
          <Select
            options={[
              { value: 'Sent', label: 'Sent' },
              { value: 'Accepted', label: 'Accepted' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modals>
  );
};

export default NewQuotationModal;
