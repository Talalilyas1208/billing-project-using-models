import React from 'react';
import { Menu, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardOutlined, FileTextOutlined } from '@ant-design/icons';
import { useGetSidebarQuery } from '../../../redux/api/api';
import { defaultNavItems, iconMap } from './sidebar.constants';

const { Text } = Typography;

const SidebarNav = () => {
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
    <>
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

      {isLoading ? (
        <div style={{ flex: 1, padding: '16px 20px', color: '#475569', fontSize: 12 }}>
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
    </>
  );
};

export default SidebarNav;