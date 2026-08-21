import React from 'react';
import { Modal } from 'antd';

// Shared modal shell used across the app so every dialog looks and behaves consistently.
export default function Modals({
  isOpen,
  onClose,
  onCancel,
  title,
  width = 640,
  destroyOnHidden = true,
  children,
  ...rest
}) {
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel || onClose}
      title={title}
      width={width}
      destroyOnHidden={destroyOnHidden}
      {...rest}
    >
      {children}
    </Modal>
  );
}
