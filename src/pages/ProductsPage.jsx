import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal, Form, App as AntApp } from 'antd';
import Button from '../components/common/Button';
import ManageProductForm from '../components/products/ManageProductForm';
import { useGetProductsQuery, useDeleteProductMutation } from '../redux/api/blackListApi';

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
    if (window.confirm(`Are you sure you want to delete product ${id}?`)) {
      await deleteProduct(id);
      refetch();
    }
  };

  return (
    <AntApp>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Products Catalog (ManageProductForm)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Consuming blackListApi & api RTK Query endpoints
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Add New Product
          </Button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product ID / Number</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Revenue Category</th>
                <th className="py-3 px-4">VAT</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 animate-pulse">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-blue-600">{p.productNumber || p.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{p.productname || p.name}</div>
                      {p.description && p.description !== "12" && (
                        <div className="text-[10px] text-slate-400 font-normal">{p.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.revenueCategory}</td>
                    <td className="py-3 px-4 text-slate-500">{p.vat}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ${Number(p.price || 0).toFixed(2)} ({p.currency || 'USD'})
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* AntD Modal for ManageProductForm */}
        <Modal
          title={editingProduct ? "Edit Product" : "Manage Product"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          destroyOnClose
        >
          <ManageProductForm
            form={form}
            editingProduct={editingProduct}
            onClose={() => setIsModalVisible(false)}
            refetchProducts={refetch}
          />
        </Modal>
      </div>
    </AntApp>
  );
};

export default ProductsPage;
