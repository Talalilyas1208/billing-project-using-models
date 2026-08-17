import React from 'react';
import { Select } from 'antd';

export default function Payementdeadline({ open, onOpenChange, customers = [], loading }) {
  const deadlineArray = Array.isArray(customers?.data)
    ? customers.data
    : Array.isArray(customers)
    ? customers
    : [];

  const options = deadlineArray.map((d, index) => {
    const val = String(d.days !== undefined ? d.days : d.value || d.id || index);
    const label = d.label || `${d.days || 0} days after`;
    return {
      value: val,
      label: label,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Payment Deadline</label>
      <Select
        open={open}
        onDropdownVisibleChange={onOpenChange}
        loading={loading}
        placeholder="Select payment deadline"
        size="large"
        style={{ width: '100%' }}
        options={options}
      />
    </div>
  );
}
