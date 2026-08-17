import React from 'react';
import { Modal } from 'antd';

export default function Modals({ isOpen, onClose, onCancel, children, rest = {} }) {
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel || onClose}
      footer={null}
      {...rest}
    >
      {children}
    </Modal>
  );
}
