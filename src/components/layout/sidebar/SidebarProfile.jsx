import React, { useState } from 'react';
import { Avatar, Divider, Popover, Typography } from 'antd';
import {
  LogoutOutlined,
  SettingOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const SidebarProfile = ({ userSession, onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const userName = userSession?.name || 'Direct Session';
  const userEmail = userSession?.email || 'user@billingapp.com';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const handleAccountAction = () => {
    setProfileOpen(false);
    onLogout?.();
  };

  return (
    <div
      style={{
        padding: '12px 12px 16px',
        borderTop: '1px solid #1e293b',
        flexShrink: 0,
      }}
    >
      <Popover
        trigger="click"
        placement="topLeft"
        open={profileOpen}
        onOpenChange={setProfileOpen}
        content={
          <div style={{ width: 228 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 2px 12px' }}>
              <Avatar
                size={40}
                src={userSession?.photoURL}
                style={{ background: '#2563eb', color: '#fff', fontWeight: 700 }}
              >
                {initials}
              </Avatar>
              <div style={{ minWidth: 0, lineHeight: 1.25 }}>
                <Text strong ellipsis={{ tooltip: userName }} style={{ display: 'block', maxWidth: 170 }}>
                  {userName}
                </Text>
                <Text type="secondary" ellipsis={{ tooltip: userEmail }} style={{ display: 'block', maxWidth: 170, fontSize: 12 }}>
                  {userEmail}
                </Text>
              </div>
            </div>
            <Divider style={{ margin: '0 0 8px' }} />
            <button
              type="button"
              onClick={handleAccountAction}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 8px',
                border: 0,
                borderRadius: 6,
                background: 'transparent',
                color: '#334155',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 13,
              }}
            >
              <UserSwitchOutlined />
              Change account
            </button>
            <button
              type="button"
              onClick={handleAccountAction}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 8px',
                border: 0,
                borderRadius: 6,
                background: 'transparent',
                color: '#dc2626',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 13,
              }}
            >
              <LogoutOutlined />
              Log out
            </button>
          </div>
        }
      >
        <button
          type="button"
          aria-label="Open account menu"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 8px',
            border: '1px solid #1e293b',
            borderRadius: 8,
            background: profileOpen ? '#1e293b' : 'transparent',
            color: '#fff',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Avatar
            size={32}
            src={userSession?.photoURL}
            style={{ background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}
          >
            {initials}
          </Avatar>
          <div style={{ minWidth: 0, flex: 1, lineHeight: 1.25 }}>
            <span style={{ display: 'block', color: '#f8fafc', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </span>
            <span style={{ display: 'block', color: '#94a3b8', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail}
            </span>
          </div>
          <SettingOutlined style={{ color: '#64748b', fontSize: 14, flexShrink: 0 }} />
        </button>
      </Popover>
    </div>
  );
};

export default SidebarProfile;