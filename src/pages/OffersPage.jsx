import React, { useMemo, useState } from 'react';
import { Typography } from 'antd';
import Button from '../components/common/Button';
import { FileDoneOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetProductsQuery } from '../redux/api/blackListApi';
import NewQuotationModal from '../components/offers/NewQuotationModal';
import Badge from '../components/common/Badge';
import PageHeader from '../components/layout/PageHeader';
import DataTable from '../components/table/DataTable';
import { normalizeApiResponse } from '../utils/apiNormalization';

const { Text } = Typography;

const OffersPage = () => {
  const { data: response = {}, isLoading } = useGetProductsQuery({ page: 1, limit: 10 });
  const products = normalizeApiResponse(response);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualOffers, setManualOffers] = useState([]);

  const productOffers = useMemo(
    () =>
      products.map((p, index) => ({
        id: `OFF-2026-10${index + 1}`,
        customer: p.supplier !== '12' ? p.supplier : 'Acme Corporation',
        title: p.description !== '12' ? p.description : 'Enterprise Solution Package',
        total: Number(p.price || 0) * 1.5,
        validUntil: '2026-09-15',
        status: index % 2 === 0 ? 'Accepted' : 'Sent',
        currency: p.currency || 'USD',
      })),
    [products]
  );

  const offers = useMemo(() => [...manualOffers, ...productOffers], [manualOffers, productOffers]);

  const handleCreateQuotation = (quotation) => {
    setManualOffers((prev) => [quotation, ...prev]);
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Offer ID',
      dataIndex: 'id',
      key: 'id',
      render: (val) => (
        <Text strong style={{ color: '#2563eb' }}>
          {val}
        </Text>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (val) => <Text strong>{val}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'title',
      key: 'title',
      render: (val) => <Text type="secondary">{val}</Text>,
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (val) => <Text type="secondary">{val}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => (
        <Badge status={val} />
      ),
    },
    {
      title: 'Total Amount',
      key: 'total',
      align: 'right',
      render: (_, record) => (
        <Text strong>
          ${record.total.toFixed(2)} ({record.currency})
        </Text>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <PageHeader
        title="Quotations &amp; Offers"
        icon={FileDoneOutlined}
        subtitle="Dynamic offer data loaded via RTK Query API"
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            New Quotation
          </Button>
        }
      />

      {/* Offers Table */}
      <DataTable
        dataSource={offers}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        size="middle"
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />

      {/* New Quotation Modal */}
      <NewQuotationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateQuotation}
      />
    </div>
  );
};

export default OffersPage;
