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
    sessionStorage.removeItem('direct_user_session');
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
        sessionStorage.setItem('direct_user_session', JSON.stringify(userSession));
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
        sessionStorage.setItem('direct_user_session', JSON.stringify(userSession));
        onAuthenticate(userSession);
        navigate('/dashboard/invoices', { replace: true });
      }
    } catch (err) {
      console.error('Firebase Auth error:', err);
      sessionStorage.removeItem('direct_user_session');
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
      sessionStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      sessionStorage.removeItem('direct_user_session');
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
      sessionStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      sessionStorage.removeItem('direct_user_session');
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
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: '#2563eb',
              color: '#fff',
              fontWeight: 800,
              fontSize: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
            }}
          >
            B
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
            {isRegisterMode ? 'Create Billy.dk Account' : 'Sign in to Billy.dk'}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {isRegisterMode
              ? 'Register a new account in Firebase Authentication'
              : 'Sign in with your registered Firebase account'}
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16, borderRadius: 8, fontSize: 12 }}
          />
        )}

        {successMsg && (
          <Alert
            message={successMsg}
            type="success"
            showIcon
            style={{ marginBottom: 16, borderRadius: 8, fontSize: 12 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          size="large"
        >
          {isRegisterMode && (
            <Form.Item
              name="displayName"
              label={<Text style={{ fontSize: 12, fontWeight: 600 }}>Full Name / Display Name</Text>}
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label={<Text style={{ fontSize: 12, fontWeight: 600 }}>Email Address</Text>}
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text style={{ fontSize: 12, fontWeight: 600 }}>Password</Text>}
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              icon={isRegisterMode ? <UserAddOutlined /> : <LoginOutlined />}
              style={{
                height: 44,
                borderRadius: 8,
                fontWeight: 700,
                background: '#2563eb',
              }}
            >
              {isRegisterMode ? 'Register Account in Firebase' : 'Sign In with Firebase'}
            </Button>
          </Form.Item>
        </Form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12 }}>
          <Text type="secondary">
            {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <Link onClick={toggleMode} style={{ fontWeight: 700, color: '#2563eb' }}>
            {isRegisterMode ? 'Sign In' : 'Register / Sign Up'}
          </Link>
        </div>

        {/* Social Authentication */}
        <Divider style={{ margin: '20px 0 16px', fontSize: 11, color: '#94a3b8' }}>
          Or continue with
        </Divider>

        <Row gutter={12}>
          <Col span={12}>
            <Button
              block
              onClick={handleGoogleLogin}
              disabled={isLoading}
              icon={<GoogleOutlined />}
              style={{ borderRadius: 8, fontSize: 12 }}
            >
              Google
            </Button>
          </Col>
          <Col span={12}>
            <Button
              block
              onClick={handleFacebookLogin}
              disabled={isLoading}
              style={{ borderRadius: 8, fontSize: 12 }}
            >
              Facebook
            </Button>
          </Col>
        </Row>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <SafetyCertificateOutlined style={{ color: '#10b981' }} />
            <span>Strict Firebase Auth (Session Storage)</span>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
