import React from 'react';
import { Select, Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function CustomerSelect({ open, onOpenChange, onCreateNew, customers = [], loading }) {
  const options = customers.map((c) => ({
    value: c.id || c.name || c.Company_name,
    label: c.Company_name || c.name || c.email || `Customer ${c.id}`,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Customer</label>
      <Select
        open={open}
        onDropdownVisibleChange={onOpenChange}
        loading={loading}
        showSearch
        placeholder="Select customer"
        size="large"
        style={{ width: '100%' }}
        options={options}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={onCreateNew}
              style={{ width: '100%', textAlign: 'left' }}
            >
              Create New Customer
            </Button>
          </>
        )}
      />
    </div>
  );
}
