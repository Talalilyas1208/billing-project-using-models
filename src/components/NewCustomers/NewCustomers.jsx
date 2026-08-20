import React from 'react';
import { Form, Input } from 'antd';
import Button from '../common/Button';
import { useAddCustomerMutation } from '../../redux/api/blackListApi';

export default function NewCustomers({ refetchCustomers, onClose, onTouch, form }) {
  const [addCustomer, { isLoading }] = useAddCustomerMutation();

  const handleFinish = async (values) => {
    try {
      await addCustomer(values).unwrap();
      if (refetchCustomers) refetchCustomers();
      if (form) form.resetFields();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to create customer:', err);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={onTouch}
      style={{ paddingTop: '12px' }}
    >
      <Form.Item
        name="name"
        label="Company / Customer Name"
        rules={[{ required: true, message: 'Please enter company name' }]}
      >
        <Input placeholder="Acme Inc." size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Billing Email"
        rules={[{ required: true, message: 'Please enter email' }]}
      >
        <Input type="email" placeholder="billing@acme.com" size="large" />
      </Form.Item>

      <Form.Item name="country" label="Country">
        <Input placeholder="Denmark" size="large" />
      </Form.Item>

      <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '8px', marginTop: '16px' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Create Customer
        </Button>
      </div>
    </Form>
  );
}
