import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

const DashboardLayout = React.memo(({ userSession, onLogout }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header userSession={userSession} onLogout={onLogout} />
        <Content
          style={{
            padding: 32,
            overflowY: 'auto',
            background: '#f8fafc',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
