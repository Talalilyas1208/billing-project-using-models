import React from 'react';
import { Layout } from 'antd';
import SidebarBrand from './sidebar/SidebarBrand';
import SidebarNav from './sidebar/SidebarNav';
import SidebarProfile from './sidebar/SidebarProfile';

const { Sider } = Layout;

const Sidebar = ({ userSession, onLogout }) => {

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
      <SidebarBrand />
      <SidebarNav />
      <SidebarProfile userSession={userSession} onLogout={onLogout} />
    </Sider>
  );
};

export default Sidebar;
