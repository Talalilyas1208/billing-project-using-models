import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Divider,
  Space,
  Row,
  Col,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  formatFirebaseError,
} from '../firebase/config';

const { Title, Text, Link } = Typography;

const LoginPage = ({ onAuthenticate }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError]         = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading]  = useState(false);

  useEffect(() => {
    localStorage.removeItem('direct_user_session');
  }, []);

  const handleSubmit = async (values) => {
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const user = await registerWithEmail(values.email, values.password, values.displayName);
        const userSession = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || values.email.split('@')[0],
          photoURL: user.photoURL || null,
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem('direct_user_session', JSON.stringify(userSession));
        onAuthenticate(userSession);
        navigate('/dashboard/invoices', { replace: true });
      } else {
        const user = await loginWithEmail(values.email, values.password);
        const userSession = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || values.email.split('@')[0],
          photoURL: user.photoURL || null,
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem('direct_user_session', JSON.stringify(userSession));
        onAuthenticate(userSession);
        navigate('/dashboard/invoices', { replace: true });
      }
    } catch (err) {
      console.error('Firebase Auth error:', err);
      localStorage.removeItem('direct_user_session');
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      const userSession = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Google User',
        photoURL: user.photoURL || null,
        authenticatedAt: new Date().toISOString(),
      };
      localStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      localStorage.removeItem('direct_user_session');
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await loginWithFacebook();
      const userSession = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Facebook User',
        photoURL: user.photoURL || null,
        authenticatedAt: new Date().toISOString(),
      };
      localStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      localStorage.removeItem('direct_user_session');
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode((prev) => !prev);
    setError('');
    form.resetFields();
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
        {/* Brand */}
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
            {isRegisterMode ? 'Create Billy.dk Account' : 'Sign in to Billy.dk'}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {isRegisterMode
              ? 'Register a new account in Firebase Authentication'
              : 'Sign in with your registered Firebase account'}
          </Text>
        </div>

        {/* Error / Success */}
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
        )}
        {successMsg && (
          <Alert message={successMsg} type="success" showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
        )}

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          {isRegisterMode && (
            <Form.Item
              name="displayName"
              label="Full Name / Display Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input size="large" placeholder="John Doe" />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input
              size="large"
              placeholder="user@billy.dk"
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              size="large"
              placeholder="Enter your password"
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
              icon={isRegisterMode ? <UserAddOutlined /> : <LoginOutlined />}
            >
              {isRegisterMode ? 'Register Account in Firebase' : 'Sign In with Firebase'}
            </Button>
          </Form.Item>
        </Form>

        {/* Toggle */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 12 }}>
            {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <Link onClick={toggleMode} style={{ fontSize: 12, fontWeight: 700 }}>
            {isRegisterMode ? 'Sign In' : 'Register / Sign Up'}
          </Link>
        </div>

        {/* Social Auth */}
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

        {/* Security Footer */}
        <Divider style={{ marginBottom: 8 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <SafetyCertificateOutlined style={{ color: '#10b981', fontSize: 13 }} />
          <Text style={{ fontSize: 11, color: '#94a3b8' }}>
            Strict Firebase Auth (Project: billing-project-1-c6b55)
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
