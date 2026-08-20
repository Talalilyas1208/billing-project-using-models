import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Typography } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { validateSignupForm } from '../utils/validation';
import { registerWithEmail } from '../firebase/config';
import {
  setAuthLoading,
  loginSuccess,
  loginFailure,
  clearAuthError,
} from '../redux/slices/authSlice';

const { Title, Text } = Typography;

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleSignup = async (values) => {
    dispatch(clearAuthError());

    // 1. Client-Side Validation Layer
    const { isValid, errors } = validateSignupForm({
      email: values.email,
      password: values.password,
      displayName: values.displayName,
      phone: values.phone,
    });

    if (!isValid) {
      const fieldErrors = Object.entries(errors).map(([name, err]) => ({
        name,
        errors: [err],
      }));
      form.setFields(fieldErrors);
      return;
    }

    // 2. Dispatch Auth & Firebase Register
    dispatch(setAuthLoading(true));
    try {
      const user = await registerWithEmail(values.email, values.password, values.displayName, values.phone);
      dispatch(loginSuccess(user));
      navigate('/dashboard/invoices');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Registration failed. Try again.'));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 16,
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          border: '1px solid #e2e8f0',
        }}
        styles={{ body: { padding: 32 } }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              fontSize: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
            }}
          >
            B
          </div>
          <Title level={4} style={{ margin: 0 }}>
            Create Billy.dk Account
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Start issuing invoices in seconds
          </Text>
        </div>

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
        )}

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignup}
          requiredMark={false}
        >
          <Form.Item
            label="Full Name / Display Name"
            name="displayName"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input
              size="large"
              placeholder="John Doe"
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
            />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input
              size="large"
              placeholder="john@example.com"
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input
              size="large"
              placeholder="+45 12 34 56 78"
              prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter a password' }]}
          >
            <Input.Password
              size="large"
              placeholder="At least 6 characters"
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
              icon={<UserAddOutlined />}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        {/* Footer Link to Login */}
        <div style={{ textAlign: 'center', fontSize: 12 }}>
          <Text type="secondary">Already have an account? </Text>
          <Link to="/login" style={{ fontWeight: 700, color: '#2563eb' }}>
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
