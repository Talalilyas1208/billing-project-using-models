import React from 'react';
import { Button as AntButton } from 'antd';


const variantMap = {
  primary:   { type: 'primary' },
  secondary: { type: 'default' },
  outline:   { type: 'default' },
  ghost:     { type: 'text' },
  danger:    { type: 'primary', danger: true },
};

const sizeMap = {
  sm: 'small',
  md: 'middle',
  lg: 'large',
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  onClick,
  block = false,
  className = '',
  ...props
}) => {
  const antVariant = variantMap[variant] || variantMap.primary;
  const antSize   = sizeMap[size] || 'middle';

  return (
    <AntButton
      htmlType={type}
      type={antVariant.type}
      danger={antVariant.danger}
      size={antSize}
      loading={isLoading}
      disabled={disabled || isLoading}
      onClick={onClick}
      block={block}
      icon={Icon ? <Icon style={{ width: 14, height: 14 }} /> : undefined}
      className={className}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
