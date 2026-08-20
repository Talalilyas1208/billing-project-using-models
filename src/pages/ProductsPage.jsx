import React, { useState } from 'react';
import { Table, Space, Typography, Tooltip, Modal, Form, App as AntApp } from 'antd';
import Button from '../components/common/Button';
import {
  AppstoreOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import ManageProductForm from '../components/products/ManageProductForm';
import Modals from '../components/Modal';
import { useGetProductsQuery, useDeleteProductMutation } from '../redux/api/blackListApi';

const { Title, Text } = Typography;

const ProductsPage = () => {
  const [form] = Form.useForm();
  const { data: response = {}, isLoading, refetch } = useGetProductsQuery({ page: 1, limit: 10 });
  const [deleteProduct] = useDeleteProductMutation();

  const products = Array.isArray(response) ? response : response.data || [];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    form.setFieldsValue({
      productname: prod.productname || prod.name || '',
      description: prod.description || '',
      revenueCategory: prod.revenueCategory || 'monthyly-recurring',
      vat: prod.vat || 'Normal sale of goods',
      price: Number(prod.price || 0),
      currency: prod.currency || 'USD',
      productNumber: prod.productNumber || prod.id || '',
      supplier: prod.supplier || '',
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Delete Product',
      content: `Are you sure you want to delete product ${id}?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteProduct(id);
        refetch();
      },
    });
  };

  const columns = [
    {
      title: 'Product ID / Number',
      key: 'productNumber',
      render: (_, record) => (
        <Text strong style={{ color: '#2563eb' }}>
          {record.productNumber || record.id}
        </Text>
      ),
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <div>
          <Text strong>{record.productname || record.name}</Text>
          {record.description && record.description !== '12' && (
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Revenue Category',
      dataIndex: 'revenueCategory',
      key: 'revenueCategory',
      render: (val) => <Text type="secondary">{val}</Text>,
    },
    {
      title: 'VAT',
      dataIndex: 'vat',
      key: 'vat',
      render: (val) => <Text type="secondary">{val}</Text>,
    },
    {
      title: 'Price',
      key: 'price',
      align: 'right',
      render: (_, record) => (
        <Text strong>
          ${Number(record.price || 0).toFixed(2)} ({record.currency || 'USD'})
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Product">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Product">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AntApp>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AppstoreOutlined style={{ color: '#2563eb' }} />
              Products Catalog
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Consuming blackListApi &amp; api RTK Query endpoints
            </Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            Add New Product
          </Button>
        </div>

        {/* Products Table */}
        <Table
          dataSource={products}
          columns={columns}
          rowKey={(record) => record.id}
          loading={isLoading}
          size="middle"
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />

        {/* Manage Product Modal */}
        <Modals
          title={editingProduct ? 'Edit Product' : 'Manage Product'}
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          <ManageProductForm
            form={form}
            editingProduct={editingProduct}
            onClose={() => setIsModalVisible(false)}
            refetchProducts={refetch}
          />
        </Modals>
      </div>
    </AntApp>
  );
};

export default ProductsPage;
