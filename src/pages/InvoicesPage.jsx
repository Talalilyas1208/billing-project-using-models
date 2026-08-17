import React, { useState } from 'react';
import { Plus, RefreshCw, FileText, CheckCircle2, Clock, Filter, Eye } from 'lucide-react';
import Button from '../components/common/Button';
import InvoiceStats from '../components/invoices/InvoiceStats';
import BillyInvoiceModal from '../components/invoices/BillyInvoiceModal';
import InvoiceDetailModal from '../components/invoices/InvoiceDetailModal';
import Badge from '../components/common/Badge';
import {
  useGetInvoicesQuery,
  useUpdateInvoiceMutation,
} from '../redux/api/api';

const InvoicesPage = () => {
  const { data: invoicesResponse, refetch, isLoading } = useGetInvoicesQuery();
  const [updateInvoice] = useUpdateInvoiceMutation();

  const invoicesList = Array.isArray(invoicesResponse?.data)
    ? invoicesResponse.data
    : Array.isArray(invoicesResponse)
    ? invoicesResponse
    : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter invoices by status
  const filteredInvoices = invoicesList.filter((inv) => {
    if (statusFilter === 'All') return true;
    return (inv.status || '').toLowerCase() === statusFilter.toLowerCase();
  });

  const handleMarkAsPaid = async (inv) => {
    try {
      await updateInvoice({ id: inv.id, status: 'Paid' }).unwrap();
      if (refetch) refetch();
    } catch (err) {
      console.error('Failed to update invoice status:', err);
    }
  };

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
            Connected to POST /api/invoice with live status tracking (Pending & Paid Receipts)
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
      <InvoiceStats invoices={invoicesList} />

      {/* Invoices Collection Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Header Controls & Status Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>Invoices Collection ({filteredInvoices.length})</span>
          </h3>

          {/* Status Filter Options (All, Pending, Paid, Approved) */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {['All', 'Pending', 'Paid', 'Approved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Invoice ID</th>
              <th className="py-3 px-4">Client / Customer</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 animate-pulse">
                  Loading invoices via /api/invoice...
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">No invoices found</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No invoices matching filter "{statusFilter}". Click below to create your first invoice.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => setIsModalOpen(true)}
                    className="mx-auto"
                  >
                    Create Invoice
                  </Button>
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const isPaid = (inv.status || '').toLowerCase() === 'paid';
                const grandTotal = Number(inv.amount || inv.grandTotal || 0);

                return (
                  <tr key={inv.id || inv.invoiceNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-600">
                      {inv.invoiceNumber || inv.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {inv.client || inv.customerName || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{inv.date || inv.issueDate || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-500">{inv.dueDate || 'N/A'}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${grandTotal.toFixed(2)} ({inv.currency || 'USD'})
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={inv.status || 'Pending'} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {!isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Mark Paid</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
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
