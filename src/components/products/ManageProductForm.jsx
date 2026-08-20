import React, { useMemo } from "react";
import { Row, Col, Space, Form, App, Input, Select, InputNumber, Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
  useGetRevenueCategoriesQuery,
  useGetCurrenciesQuery,
  useGetVatQuery,
} from "../../redux/api/api";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../../redux/api/blackListApi";

const { TextArea } = Input;

export default function ManageProductForm(props) {
  const { form, onClose, editingProduct, refetchProducts, onTouch, onSuccess } = props;
  const navigate = useNavigate();

  // Handle message gracefully whether inside AntD App context or standalone
  let messageInstance;
  try {
    const appCtx = App.useApp();
    messageInstance = appCtx?.message;
  } catch (e) {
    messageInstance = null;
  }

  const { data: revenueCategory } = useGetRevenueCategoriesQuery();
  const { data: currencies } = useGetCurrenciesQuery();
  const { data: vat } = useGetVatQuery();

  const [addProduct, { isLoading: addingProduct }] = useAddProductMutation();
  const [updateProduct, { isLoading: updatingProduct }] = useUpdateProductMutation();

  const currencyData = Array.isArray(currencies?.data)
    ? currencies.data
    : Array.isArray(currencies)
    ? currencies
    : [];

  const revenueData = Array.isArray(revenueCategory?.data)
    ? revenueCategory.data
    : Array.isArray(revenueCategory)
    ? revenueCategory
    : [];

  const vatData = Array.isArray(vat?.data)
    ? vat.data
    : Array.isArray(vat)
    ? vat
    : [];

  const currencyOptions = useMemo(
    () =>
      currencyData.map((item) => ({
        value: item.code,
        label: `${item.symbol ? item.symbol + ' ' : ''}${item.code} - ${item.name || ''}`,
      })),
    [currencyData]
  );

  const revenueOptions = useMemo(
    () =>
      revenueData.map((item) => ({
        value: String(item.key || item.code || item.id || ""),
        label: item.code || item.label || item.name || "Select Category",
      })),
    [revenueData]
  );

  const vatoptions = useMemo(
    () =>
      vatData.map((item) => ({
        value: item.code || item.key || item.label,
        label: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{item.code || item.label}</span>
            {item.description && (
              <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                {item.description}
              </span>
            )}
          </div>
        ),
      })),
    [vatData]
  );

  const isediting = Boolean(editingProduct);

  const onFinish = async (values) => {
    try {
      if (isediting) {
        await updateProduct({ id: editingProduct.id, ...values }).unwrap();
      } else {
        await addProduct(values).unwrap();
      }
      if (messageInstance) {
        messageInstance.success("Product saved successfully");
      } else {
        alert("Product saved successfully!");
      }

      if (form) {
        form.resetFields();
      }

      if (refetchProducts) {
        refetchProducts();
      }
      if (typeof onSuccess === "function") {
        onSuccess(values);
      }
      if (onClose) {
        onClose();
      } else {
        navigate("/dashboard/products");
      }
    } catch (err) {
      console.error("Save failed:", err);
      if (messageInstance) {
        messageInstance.error("Failed to save product");
      } else {
        alert("Failed to save product");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={() => onTouch && onTouch()}
      >
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="productname"
              label="Name"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input
                size="large"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  borderRadius: "0.5rem",
                  width: "100%",
                }}
              />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea
                placeholder="None"
                autoSize={{ minRows: 2, maxRows: 2 }}
                size="large"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  borderRadius: "0.5rem",
                }}
              />
            </Form.Item>
            <Form.Item
              name="revenueCategory"
              label="Revenue Category"
              rules={[{ required: true, message: "Please select revenue category" }]}
            >
              <Select showSearch options={revenueOptions} size="large" />
            </Form.Item>
            <Form.Item name="vat" label="VAT" rules={[{ required: true, message: "Please select VAT" }]}>
              <Select showSearch options={vatoptions} size="large" />
            </Form.Item>
          </Col>
          <Col span={1}>
            <Space />
          </Col>
          <Col span={9}>
            <Row gutter={12}>
              <Col span={16}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: "Enter price" }]}
                >
                  <InputNumber
                    size="large"
                    precision={2}
                    style={{
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      borderRadius: "0.5rem",
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true, message: "choose currency" }]}
                >
                  <Select showSearch options={currencyOptions} size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="productNumber"
              label="Product Number"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                size="large"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  borderRadius: "0.5rem",
                }}
              />
            </Form.Item>
            <Form.Item name="supplier" label="Supplier Product Number">
              <Input
                size="large"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  borderRadius: "0.5rem",
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 20,
            position: "sticky",
            bottom: 0,
            background: "#fff",
            padding: "12px 0",
            zIndex: 10,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={addingProduct || updatingProduct}
            loading={addingProduct || updatingProduct}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "0.5rem",
              padding: '0 32px',
              height: 40,
            }}
          >
            {isediting ? "Update" : "Save Product"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
