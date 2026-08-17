import React from 'react';
import { Select, Button, Divider, Empty } from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';

export default function CustomerSelect({ open, onOpenChange, onCreateNew, customers = [], loading, value, onChange }) {
  const customerList = Array.isArray(customers) ? customers : [];
  const hasCustomers = customerList.length > 0;

  const options = customerList.map((c) => ({
    value: c.id || c.name || c.Company_name,
    label: c.Company_name || c.name || c.email || `Customer ${c.id}`,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifySelf: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Customer</label>
        {hasCustomers && (
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            onClick={onCreateNew}
            style={{ padding: 0, height: 'auto', fontSize: '11px' }}
          >
            + Create New
          </Button>
        )}
      </div>

      {!hasCustomers && !loading ? (
        <div
          style={{
            border: '1px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
            No customers available
          </p>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={onCreateNew}
            size="medium"
            style={{ backgroundColor: '#2563eb' }}
          >
            Create Customer
          </Button>
        </div>
      ) : (
        <Select
          open={open}
          onDropdownVisibleChange={onOpenChange}
          loading={loading}
          showSearch
          value={value}
          onChange={onChange}
          placeholder="Select customer..."
          size="large"
          style={{ width: '100%' }}
          options={options}
          notFoundContent={
            <Empty description="No customers found">
              <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onCreateNew}>
                Create Customer
              </Button>
            </Empty>
          }
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={onCreateNew}
                style={{ width: '100%', textAlign: 'left', fontWeight: 600, color: '#2563eb' }}
              >
                Create New Customer
              </Button>
            </>
          )}
        />
      )}
    </div>
  );
}
