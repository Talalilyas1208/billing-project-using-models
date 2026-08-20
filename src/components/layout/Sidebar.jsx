import React from 'react';
import { Layout, Menu, Typography, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileTextOutlined,
  AppstoreOutlined,
  FileDoneOutlined,
  PhoneOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useGetSidebarQuery } from '../../redux/api/api';

const { Sider } = Layout;
const { Text } = Typography;

const defaultNavItems = [
  { key: '/dashboard/invoices',  label: 'Invoices',   icon: <FileTextOutlined /> },
  { key: '/dashboard/products',  label: 'Products',   icon: <AppstoreOutlined /> },
  { key: '/dashboard/offers',    label: 'Offers',     icon: <FileDoneOutlined /> },
  { key: '/dashboard/contact',   label: 'Contact',    icon: <PhoneOutlined /> },
  { key: '/dashboard/customer',  label: 'Customers',  icon: <TeamOutlined /> },
];

const iconMap = {
  Invoice: <FileTextOutlined />,
  Invoices: <FileTextOutlined />,
  invoices: <FileTextOutlined />,
  Products: <AppstoreOutlined />,
  products: <AppstoreOutlined />,
  Offers: <FileDoneOutlined />,
  offers: <FileDoneOutlined />,
  Contact: <PhoneOutlined />,
  contact: <PhoneOutlined />,
  Customer: <TeamOutlined />,
  Customers: <TeamOutlined />,
  customer: <TeamOutlined />,
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: sidebarResponse, isLoading } = useGetSidebarQuery();

  const rawSidebarData = Array.isArray(sidebarResponse)
    ? sidebarResponse
    : Array.isArray(sidebarResponse?.data)
    ? sidebarResponse.data
    : [];

  let navItems = [];
  if (rawSidebarData.length > 0) {
    rawSidebarData.forEach((item) => {
      if (item.children && Array.isArray(item.children)) {
        item.children.forEach((child) => {
          const name = child.name || child.label || 'Page';
          navItems.push({
            key: child.link || child.path || '/dashboard',
            label: name,
            icon: iconMap[child.name || child.key] || <FileTextOutlined />,
          });
        });
      } else {
        const name = item.label || item.name || item.key || 'Page';
        navItems.push({
          key: item.path || item.link || `/dashboard/${(item.key || item.label || '').toLowerCase()}`,
          label: name,
          icon: iconMap[item.key || item.name || item.label] || <FileTextOutlined />,
        });
      }
    });
  }

  if (navItems.length === 0) {
    navItems = defaultNavItems;
  }

  const selectedKey = navItems.find((item) => location.pathname.startsWith(item.key))?.key || '';

  return (
    <Sider
      width={220}
      style={{
        background: '#0f172a',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Brand */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          borderBottom: '1px solid #1e293b',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          B
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: '18px' }}>
            Billy.dk
          </div>
          <div style={{ color: '#64748b', fontSize: 10, lineHeight: '14px' }}>
            Accounting Dashboard
          </div>
        </div>
      </div>

      {/* Nav Label */}
      <div
        style={{
          padding: '16px 20px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <DashboardOutlined style={{ color: '#3b82f6', fontSize: 11 }} />
        <Text style={{ color: '#475569', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Main Navigation
        </Text>
      </div>

      {/* Menu */}
      {isLoading ? (
        <div style={{ padding: '16px 20px', color: '#475569', fontSize: 12 }}>
          Loading navigation...
        </div>
      ) : (
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(key)}
          items={navItems}
          style={{
            background: 'transparent',
            border: 'none',
            flex: 1,
            padding: '0 8px',
          }}
        />
      )}

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SafetyCertificateOutlined style={{ color: '#10b981', fontSize: 12 }} />
          <Text style={{ color: '#64748b', fontSize: 11 }}>Routes Operational</Text>
        </div>
        <Tag color="default" style={{ fontSize: 10, margin: 0 }}>RTK Query</Tag>
      </div>
    </Sider>
  );
};

export default Sidebar;
