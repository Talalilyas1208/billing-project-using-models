import React, { useState } from 'react';
import { Plus, RefreshCw, FileText } from 'lucide-react';
import Button from '../components/common/Button';
import InvoiceStats from '../components/invoices/InvoiceStats';
import BillyInvoiceModal from '../components/invoices/BillyInvoiceModal';
import InvoiceDetailModal from '../components/invoices/InvoiceDetailModal';
import Badge from '../components/common/Badge';
import { useGetProductsQuery } from '../redux/api/blackListApi';

const InvoicesPage = () => {
  // Consumes dynamic products dataset via blackListApi
  const { data: productsResponse, refetch, isLoading } = useGetProductsQuery({ page: 1, limit: 10 });
  const products = Array.isArray(productsResponse) ? productsResponse : productsResponse?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Dynamic statistics derived directly from products / invoice datasets
  const dynamicInvoices = products.map((p, index) => ({
    id: `INV-2026-00${index + 1}`,
    customerName: p.supplier !== "12" ? p.supplier : 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    issueDate: '2026-08-13',
    dueDate: '2026-08-27',
    status: index % 2 === 0 ? 'Paid' : 'Pending',
    items: [{ id: 1, description: p.productname || p.name || 'Service', quantity: 1, unitPrice: Number(p.price || 0), taxRate: 25 }],
    subtotal: Number(p.price || 0),
    taxTotal: Number(p.price || 0) * 0.25,
    grandTotal: Number(p.price || 0) * 1.25,
    currency: p.currency || 'USD',
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Billy.dk Dynamic Invoices Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic data loaded via RTK Query blackListApi & api slices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => refetch()}>
            Sync API
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Create New Invoice
          </Button>
        </div>
      </div>

      {/* KPI Stats Breakdown */}
      <InvoiceStats invoices={dynamicInvoices} />

      {/* Invoices Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Dynamic Invoices Collection ({dynamicInvoices.length})
          </h3>
        </div>
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Invoice ID</th>
              <th className="py-3 px-4">Customer / Supplier</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 animate-pulse">
                  Loading dynamic invoices via RTK Query...
                </td>
              </tr>
            ) : dynamicInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No invoices found.
                </td>
              </tr>
            ) : (
              dynamicInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-blue-600">{inv.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{inv.customerName}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.issueDate}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.dueDate}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ${inv.grandTotal.toFixed(2)} ({inv.currency})
                  </td>
                  <td className="py-3 px-4"><Badge status={inv.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Billy.dk Invoice Creator Modal */}
      <BillyInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Detail Preview Modal */}
      <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </div>
  );
};

export default InvoicesPage;
