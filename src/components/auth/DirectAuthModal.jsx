import React, { useState } from 'react';
import { Modal, Form, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * Direct Authentication component (No Redux auth slice overhead)
 * Directly manages user authentication session using Ant Design Modal / Form.
 */
const DirectAuthModal = ({ onAuthenticate, open = true, onClose }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState('');

  const handleDirectAuth = (values) => {
    const { email, password } = values;
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setError('');
    // Direct authentication callback
    const userSession = {
      email,
      name: email.split('@')[0],
      authenticatedAt: new Date().toISOString(),
    };

    localStorage.setItem('direct_user_session', JSON.stringify(userSession));
    onAuthenticate(userSession);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={440}
      centered
      destroyOnHidden
    >
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#2563eb',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          B
        </div>
        <Title level={4} style={{ margin: 0 }}>
          Direct Authentication
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Sign in directly to Billy.dk Mock Server
        </Text>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleDirectAuth}
        initialValues={{ email: 'user@billy.dk', password: 'password123' }}
        requiredMark={false}
      >
        <Form.Item
          label="Email Address"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input
            size="large"
            placeholder="user@billy.dk"
            prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            size="large"
            placeholder="••••••••"
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            icon={<LoginOutlined />}
          >
            Authenticate &amp; Access Dashboard
          </Button>
        </Form.Item>
      </Form>

      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <SafetyCertificateOutlined style={{ color: '#10b981', fontSize: 12 }} />
        <Text style={{ fontSize: 11, color: '#94a3b8' }}>
          Direct Auth Session (No Redux Slice Overhead)
        </Text>
      </div>
    </Modal>
  );
};

export default DirectAuthModal;
