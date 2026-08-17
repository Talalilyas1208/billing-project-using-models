import React from 'react';
import { ConfigProvider } from 'antd';

export default function Config({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
