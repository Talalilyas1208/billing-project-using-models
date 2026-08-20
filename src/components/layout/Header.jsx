import React from 'react';
import { Layout, Input, Avatar, Badge, Tooltip, Space, Typography } from 'antd';
import {
  BellOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = React.memo(({ userSession, onLogout }) => {
  const initials = userSession?.name
    ? userSession.name.charAt(0).toUpperCase()
    : 'U';

  return (
    <AntHeader
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Search */}
      <Input
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        placeholder="Search invoices, datasets..."
        style={{ width: 280, background: '#f8fafc', borderColor: '#e2e8f0' }}
        size="middle"
      />

      {/* Right: Bell + Avatar + Logout */}
      <Space size={16} align="center">
        <Tooltip title="Notifications">
          <Badge count={1} size="small" offset={[-2, 2]}>
            <BellOutlined
              style={{
                fontSize: 16,
                color: '#64748b',
                cursor: 'pointer',
              }}
            />
          </Badge>
        </Tooltip>

        <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />

        <Space size={10} align="center">
          <Avatar
            size={32}
            style={{ background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: 13 }}
          >
            {initials}
          </Avatar>

          <div style={{ lineHeight: '1.2' }}>
            <Text strong style={{ fontSize: 12, display: 'block', color: '#1e293b' }}>
              {userSession?.name || 'Direct Session'}
            </Text>
            <Text style={{ fontSize: 10, color: '#94a3b8' }}>
              {userSession?.email || 'user@billy.dk'}
            </Text>
          </div>

          {onLogout && (
            <Tooltip title="Log out">
              <LogoutOutlined
                onClick={onLogout}
                style={{ fontSize: 15, color: '#94a3b8', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.target.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
              />
            </Tooltip>
          )}
        </Space>
      </Space>
    </AntHeader>
  );
});

Header.displayName = 'Header';

export default Header;
