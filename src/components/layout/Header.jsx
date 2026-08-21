import React from 'react';
import { Layout, Badge, Tooltip, Space } from 'antd';
import {
  BellOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Input from '../common/Input';

const { Header: AntHeader } = Layout;

const Header = React.memo(() => {
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

      {/* Right: Notifications */}
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
      </Space>
    </AntHeader>
  );
});

Header.displayName = 'Header';

export default Header;
