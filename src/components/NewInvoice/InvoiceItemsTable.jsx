import React from 'react';
import { Table, Input, InputNumber, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function InvoiceItemsTable({
  items = [],
  onFieldChange,
  onDeleteItem,
  onMoveItem,
  onAddItem,
}) {
  const columns = [
    {
      title: 'Order',
      key: 'move',
      width: 80,
      render: (_, __, index) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<ArrowUpOutlined />}
            disabled={index === 0}
            onClick={() => onMoveItem(index, -1)}
          />
          <Button
            type="text"
            size="small"
            icon={<ArrowDownOutlined />}
            disabled={index === items.length - 1}
            onClick={() => onMoveItem(index, 1)}
          />
        </Space>
      ),
    },
    {
      title: 'Product / Service',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => (
        <Input
          placeholder="Product name..."
          value={text}
          onChange={(e) => onFieldChange(record.id, 'product', e.target.value)}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <Input
          placeholder="Description..."
          value={text}
          onChange={(e) => onFieldChange(record.id, 'description', e.target.value)}
        />
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'number',
      key: 'number',
      width: 100,
      render: (val, record) => (
        <InputNumber
          min={1}
          value={val}
          onChange={(v) => onFieldChange(record.id, 'number', v)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 140,
      render: (val, record) => (
        <InputNumber
          min={0}
          precision={2}
          placeholder="0.00"
          value={val}
          onChange={(v) => onFieldChange(record.id, 'unitPrice', v)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: 120,
      align: 'right',
      render: (_, record) => {
        const total = (Number(record.number) || 0) * (Number(record.unitPrice) || 0);
        return <strong>${total.toFixed(2)}</strong>;
      },
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDeleteItem(record.id)}
        />
      ),
    },
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
      />
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onAddItem}
        style={{ width: '100%', marginTop: '16px' }}
      >
        Add Line Item
      </Button>
    </div>
  );
}
