import React from 'react';
import { X, Printer, Download, Paperclip } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const InvoiceDetailModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-modal my-8">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">{invoice.id}</h2>
            <Badge status={invoice.status} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
              Print PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View */}
        <div className="p-8 space-y-8" id="printable-invoice">
          {/* Company Branding & Invoice Metadata */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-6">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg mb-2">
                B
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Billy.dk Solutions A/S</h3>
              <p className="text-xs text-slate-500">Østergade 12, 1100 København K</p>
              <p className="text-xs text-slate-500">CVR: 34901234 • support@billy.dk</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">INVOICE</span>
              <span className="text-xl font-extrabold text-blue-600">{invoice.id}</span>
              <p className="text-xs text-slate-500 mt-2">
                <span className="font-semibold text-slate-700">Issue Date:</span> {invoice.issueDate}
              </p>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Due Date:</span> {invoice.dueDate}
              </p>
            </div>
          </div>

          {/* Customer Billed To */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              BILLED TO:
            </span>
            <p className="text-sm font-bold text-slate-800">{invoice.customerName}</p>
            <p className="text-xs text-slate-500">{invoice.customerEmail}</p>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-2">Item / Service</th>
                <th className="py-2.5 px-2 text-center">Qty</th>
                <th className="py-2.5 px-2 text-right">Unit Price</th>
                <th className="py-2.5 px-2 text-right">Tax Rate</th>
                <th className="py-2.5 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-2 font-medium text-slate-800">{item.description}</td>
                  <td className="py-3 px-2 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-3 px-2 text-right text-slate-600">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right text-slate-600">{item.taxRate}%</td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT / Tax Total:</span>
                <span className="font-semibold">${invoice.taxTotal.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-200 my-1" />
              <div className="flex justify-between text-slate-900 font-bold text-base">
                <span>Grand Total:</span>
                <span className="text-blue-600">${invoice.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Attachment indicator if exists */}
          {invoice.attachment && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <Paperclip className="w-4 h-4" />
                <span>Attached File: {invoice.attachment}</span>
              </div>
              <Button variant="ghost" size="sm" icon={Download}>
                Download
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;
