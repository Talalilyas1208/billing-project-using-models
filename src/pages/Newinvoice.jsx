import { useState } from "react";
import { Row, Col, Form, DatePicker, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import Modals from "../components/Modal";
import CardComponent from "../components/CardComponent";
import Config from "../components/Config";
import NewCustomers from "../components/NewCustomers/NewCustomers";
import Invoicecol from "../components/ui/Invoicecol";
import useConfirmNavigation from "../hooks/useConfirmNavigation";
import InvoiceHeader from "../components/NewInvoice/InvoiceHeader";
import CustomerSelect from "../components/NewCustomers/CustomerSelect";
import InvoiceItemsTable from "../components/NewInvoice/InvoiceItemsTable";
import {
  useGetPaymentDeadlinesQuery,
  useGetVatQuery,
  useGetCurrenciesQuery,
  api,
} from "../redux/api/api";
import { useGetCustomersQuery } from "../redux/api/blackListApi";
import Payementdeadline from "../components/NewInvoice/Paymentdeadline";

export default function Newinvoice() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [statetouch, settouch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      product: "",
      description: "",
      number: 1,
      unitPrice: "",
    },
  ]);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 1. Customer Query (/api/customer)
  const {
    data: Customer,
    isLoading: CustomerLoading,
    refetch: refetchCustomers,
  } = useGetCustomersQuery({ search: searchText });

  // 2. Payment Deadline Query (/api/paymentdeadline)
  const {
    data: payementdeadline,
    isLoading: payementdeadlineLoading,
    isFetching,
  } = useGetPaymentDeadlinesQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    keepUnusedDataFor: 300,
  });

  // 3. VAT Query (/api/vat)
  const { data: vatData, isLoading: vatLoading } = useGetVatQuery();

  // 4. Currency Query (/api/currency)
  const { data: currencyData, isLoading: currencyLoading } = useGetCurrenciesQuery();

  const fallbackCustomers = [{ id: "fallback-customer", Company_name: "Demo Customer" }];
  const fallbackPaymentDeadlines = [
    { value: "7", label: "7 days" },
    { value: "14", label: "14 days" },
    { value: "30", label: "30 days" },
  ];

  const customerList =
    Array.isArray(Customer?.data) && Customer.data.length > 0
      ? Customer.data
      : Array.isArray(Customer) && Customer.length > 0
      ? Customer
      : Customer?.error
      ? fallbackCustomers
      : [];

  const paymentDeadlineList =
    Array.isArray(payementdeadline?.data) && payementdeadline.data.length > 0
      ? payementdeadline.data
      : Array.isArray(payementdeadline) && payementdeadline.length > 0
      ? payementdeadline
      : payementdeadline?.error
      ? fallbackPaymentDeadlines
      : [];

  const vatList = Array.isArray(vatData?.data)
    ? vatData.data
    : Array.isArray(vatData)
    ? vatData
    : [];

  const currencyList = Array.isArray(currencyData?.data)
    ? currencyData.data
    : Array.isArray(currencyData)
    ? currencyData
    : [];

  const vatOptions = vatList.map((item, idx) => ({
    value: String(item.key || item.code || item.id || idx),
    label: item.code || item.label || item.description || "VAT Option",
  }));

  const currencyOptions = currencyList.map((c) => ({
    value: c.code,
    label: `${c.symbol ? c.symbol + " " : ""}${c.code} - ${c.name || c.country || ""}`,
  }));

  const confirmNavigation = useConfirmNavigation(statetouch);

  // Function to invalidate the tag and force a network pull
  const purgeAndPullDeadlines = () => {
    dispatch(
      api.util.invalidateTags([{ type: "PaymentDeadline", id: "LIST" }])
    );
  };

  const handleOpen = () => {
    setIsOpen(true);
    setCustomerOpen(false);
    setPaymentOpen(false);
  };

  const handleclose = () => {
    setIsOpen(false);
    settouch(false);
    purgeAndPullDeadlines(); // Wipes old local cache data and pulls a new dataset
  };

  const handleBack = () => {
    navigate("/dashboard/invoices");
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((i) => i.id)) + 1 : 1,
        product: "",
        description: "",
        number: 1,
        unitPrice: "",
      },
    ]);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFieldChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const moveItem = (index, direction) => {
    setItems((prev) => {
      const target = index + direction;

      if (target < 0 || target >= prev.length) {
        return prev;
      }

      const updated = [...prev];

      [updated[index], updated[target]] = [updated[target], updated[index]];

      return updated;
    });
  };

  return (
    <Config>
      <InvoiceHeader onBack={handleBack} />

      <Modals
        isOpen={isOpen}
        onClose={handleclose}
        onCancel={() => confirmNavigation(handleclose)}
        destroyOnHidden
        rest={{
          okText: "Done",
          style: {
            width: 900,
            top: 170,
            title: "Create New Customer",
          },
        }}
      >
        <NewCustomers
          refetchCustomers={refetchCustomers}
          onClose={handleclose}
          onTouch={() => settouch(true)}
          form={form}
        />
      </Modals>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <CardComponent
            style={{
              width: "100%",
              borderRadius: "10px",
              borderColor: "#b9adadff",
            }}
          >
            <Row gutter={[24, 16]} justify="space-between">
              <Col xs={24} sm={12} md={10} lg={8}>
                <Row gutter={[0, 16]}>
                  <Col span={20}>
                    <CustomerSelect
                      open={customerOpen}
                      onOpenChange={setCustomerOpen}
                      onCreateNew={handleOpen}
                      customers={customerList}
                      loading={CustomerLoading}
                    />
                  </Col>

                  {/* VAT Dropdown from /api/vat */}
                  <Col span={20}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                        VAT Rate
                      </label>
                      <Select
                        placeholder="Select VAT rate"
                        size="large"
                        loading={vatLoading}
                        options={vatOptions}
                        defaultValue={vatOptions[0]?.value}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </Col>

                  {/* Currency Dropdown from /api/currency */}
                  <Col span={20}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                        Billing Currency
                      </label>
                      <Select
                        placeholder="Select currency"
                        size="large"
                        loading={currencyLoading}
                        options={currencyOptions}
                        defaultValue="USD"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} sm={12} md={10} lg={8}>
                <Row gutter={[0, 16]}>
                  <Col span={20}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "4px" }}>
                      Invoice Date
                    </label>
                    <DatePicker
                      onChange={onChange}
                      format={{
                        format: "YYYY-MM-DD ",
                        type: "mask",
                      }}
                      size="large"
                      defaultValue={dayjs()}
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>

                <Row gutter={[0, 16]}>
                  {isFetching && (
                    <p className="text-xs text-blue-600 animate-pulse">
                      Updating data in background...
                    </p>
                  )}
                  {/* Payment Deadline Dropdown from /api/paymentdeadline */}
                  <Col span={20}>
                    <Payementdeadline
                      open={paymentOpen}
                      onOpenChange={setPaymentOpen}
                      onCreateNew={handleOpen}
                      customers={paymentDeadlineList}
                      loading={payementdeadlineLoading}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <InvoiceItemsTable
              items={items}
              onFieldChange={handleFieldChange}
              onDeleteItem={handleDeleteItem}
              onMoveItem={moveItem}
              onAddItem={handleAddItem}
            />
          </CardComponent>
        </Col>
      </Row>
    </Config>
  );
}
