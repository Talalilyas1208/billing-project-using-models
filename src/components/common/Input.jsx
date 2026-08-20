import React from 'react';
import { Input as AntInput, Form } from 'antd';


const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  const prefix = Icon ? <Icon style={{ width: 14, height: 14, color: '#94a3b8' }} /> : undefined;

  const inputEl =
    type === 'password' ? (
      <AntInput.Password
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        prefix={prefix}
        status={error ? 'error' : undefined}
        className={className}
        {...props}
      />
    ) : (
      <AntInput
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        prefix={prefix}
        status={error ? 'error' : undefined}
        className={className}
        {...props}
      />
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {label && (
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {inputEl}
      {error && (
        <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 500 }}>{error}</span>
      )}
    </div>
  );
};

export default Input;
