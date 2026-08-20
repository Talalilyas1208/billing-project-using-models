import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Divider, Typography, Row, Col } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import { validateLoginForm } from '../utils/validation';
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
} from '../firebase/config';
import {
  setAuthLoading,
  loginSuccess,
  loginFailure,
  clearAuthError,
} from '../redux/slices/authSlice';

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleEmailLogin = async (values) => {
    dispatch(clearAuthError());

    // 1. Client-Side Validation Layer (Stops Firebase request if invalid)
    const { isValid, errors } = validateLoginForm({ email: values.email, password: values.password });
    if (!isValid) {
      const fieldErrors = Object.entries(errors).map(([name, err]) => ({
        name,
        errors: [err],
      }));
      form.setFields(fieldErrors);
      return;
    }

    // 2. Dispatch Auth & Firebase Sign In
    dispatch(setAuthLoading(true));
    try {
      const user = await loginWithEmail(values.email, values.password);
      dispatch(loginSuccess(user));
      navigate('/dashboard/invoices');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Failed to sign in. Check credentials.'));
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));
    try {
      const user = await loginWithGoogle();
      dispatch(loginSuccess(user));
      navigate('/dashboard/invoices');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Google sign in failed.'));
    }
  };

  const handleFacebookLogin = async () => {
    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));
    try {
      const user = await loginWithFacebook();
      dispatch(loginSuccess(user));
      navigate('/dashboard/invoices');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Facebook sign in failed.'));
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
            Sign in to Billy.dk
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Manage invoices &amp; financial reports
          </Text>
        </div>

        {/* Global Firebase Auth Error Message */}
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
        )}

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEmailLogin}
          initialValues={{ email: 'demo@billy.dk', password: 'password123' }}
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
              loading={isLoading}
              icon={<LoginOutlined />}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* Social Auth Providers */}
        <Divider style={{ fontSize: 11, color: '#94a3b8' }}>Or continue with</Divider>

        <Row gutter={12}>
          <Col span={12}>
            <Button
              block
              size="middle"
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              Google
            </Button>
          </Col>
          <Col span={12}>
            <Button
              block
              size="middle"
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              Facebook
            </Button>
          </Col>
        </Row>

        {/* Footer link to Signup */}
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12 }}>
          <Text type="secondary">Don't have an account? </Text>
          <Link to="/signup" style={{ fontWeight: 700, color: '#2563eb' }}>
            Sign up now
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
