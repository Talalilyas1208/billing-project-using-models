import React from 'react';
import { Table } from 'antd';

const defaultPagination = {
  pageSize: 10,
  showSizeChanger: true,
};

export default function DataTable({ pagination, style, ...rest }) {
  return (
    <Table
      size="middle"
      pagination={{ ...defaultPagination, ...pagination }}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    />
  );
}