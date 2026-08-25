import React from 'react';
import {
  Card,
  Form,
  Typography,
  Space,
  Row,
  Col,
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from '@ant-design/icons';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PageHeader from '../components/layout/PageHeader';

const { Text } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();

  const handleSend = () => {
    form.validateFields().then(() => {
      alert('Message sent to billing app support!');
      form.resetFields();
    });
  };

  const contactDetails = [
    {
      icon: <PhoneOutlined style={{ color: '#2563eb' }} />,
      bg: '#eff6ff',
      title: '+45 60 24 60 24',
      sub: 'Mon - Fri: 08:30 - 17:00 CET',
    },
    {
      icon: <MailOutlined style={{ color: '#059669' }} />,
      bg: '#f0fdf4',
      title: 'support@billingapp.com',
      sub: 'Avg. response time: 15 mins',
    },
    {
      icon: <EnvironmentOutlined style={{ color: '#475569' }} />,
      bg: '#f8fafc',
      title: 'billing app Headquarters',
      sub: 'Østergade 12, 1100 København K, Denmark',
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageHeader
        maxWidth={900}
        title="Support &amp; Accounting Contact"
        icon={PhoneOutlined}
        subtitle="Get in touch with billing app accounting advisors and technical support."
      />

      <Row gutter={[24, 24]}>
        {/* Contact Info Card */}
        <Col xs={24} md={12}>
          <Card
            title={<Text strong>Direct Advisor Desk</Text>}
            style={{ borderRadius: 12, height: '100%' }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {contactDetails.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 13, display: 'block' }}>
                      {item.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {item.sub}
                    </Text>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Quick Message Card */}
        <Col xs={24} md={12}>
          <Card
            title={<Text strong>Send Quick Message</Text>}
            style={{ borderRadius: 12, height: '100%' }}
          >
            <Form form={form} layout="vertical" requiredMark={false}>
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input placeholder="Tax or VAT question..." />
              </Form.Item>
              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea rows={4} placeholder="Describe your inquiry..." />
              </Form.Item>
              <Button
                type="primary"
                block
                icon={<SendOutlined />}
                onClick={handleSend}
              >
                Send Message
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;
