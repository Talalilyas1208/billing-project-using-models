import React, { useState } from 'react';
import { X, Plus, Trash2, UploadCloud, FileText } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import {
  useGetCurrenciesQuery,
  useGetPaymentDeadlinesQuery,
  useGetVatQuery,
  useGetPriceModeOptionsQuery,
  useGetDesignOptionsQuery,
  useGetapprovebuttonQuery,
  useGetFieldTypeOptionsQuery,
} from '../../redux/api/api';
import { useGetCustomersQuery } from '../../redux/api/blackListApi';

const BillyInvoiceModal = ({ isOpen, onClose }) => {
  // RTK Query endpoints
  const { data: currenciesRes } = useGetCurrenciesQuery();
  const { data: deadlinesRes } = useGetPaymentDeadlinesQuery();
  const { data: vatRes } = useGetVatQuery();
  const { data: priceOptionsRes } = useGetPriceModeOptionsQuery();
  const { data: actionButtonsRes } = useGetapprovebuttonQuery();
  const { data: fieldLabels = {} } = useGetFieldTypeOptionsQuery();
  const { data: customersResponse } = useGetCustomersQuery();

  // Normalize data arrays whether nested in .data or top-level array
  const customersList = Array.isArray(customersResponse?.data)
    ? customersResponse.data
    : Array.isArray(customersResponse)
    ? customersResponse
    : [];

  const currencyList = Array.isArray(currenciesRes?.data)
    ? currenciesRes.data
    : Array.isArray(currenciesRes)
    ? currenciesRes
    : [];

  const deadlineList = Array.isArray(deadlinesRes?.data)
    ? deadlinesRes.data
    : Array.isArray(deadlinesRes)
    ? deadlinesRes
    : [];

  const vatList = Array.isArray(vatRes?.data)
    ? vatRes.data
    : Array.isArray(vatRes)
    ? vatRes
    : [];

  const priceOptsList = Array.isArray(priceOptionsRes?.data)
    ? priceOptionsRes.data
    : Array.isArray(priceOptionsRes)
    ? priceOptionsRes
    : [];

  const approveButtonsList = Array.isArray(actionButtonsRes?.data)
    ? actionButtonsRes.data
    : Array.isArray(actionButtonsRes)
    ? actionButtonsRes
    : [];

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [paymentDeadline, setPaymentDeadline] = useState('7');
  const [selectedVat, setSelectedVat] = useState('normal_goods');
  const [priceOption, setPriceOption] = useState('excl');
  const [issueDate, setIssueDate] = useState('2026-08-17');
  const [dueDate, setDueDate] = useState('2026-08-31');

  const [items, setItems] = useState([
    { id: 1, description: 'Software Consulting & Architecture', quantity: 1, unitPrice: 1800, taxRate: 25 },
  ]);
  const [attachment, setAttachment] = useState(null);

  if (!isOpen) return null;

  const handleCustomerSelect = (e) => {
    const name = e.target.value;
    setCustomerName(name);
    const found = customersList.find((c) => (c.name || c.Company_name) === name);
    if (found) setCustomerEmail(found.email || '');
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: '', quantity: 1, unitPrice: 0, taxRate: 25 },
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const val = field === 'description' ? value : Number(value);
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0);

  const calculateTaxTotal = () =>
    items.reduce(
      (sum, item) =>
        sum + (item.quantity || 0) * (item.unitPrice || 0) * ((item.taxRate || 0) / 100),
      0
    );

  const subtotal = calculateSubtotal();
  const taxTotal = calculateTaxTotal();
  const grandTotal = subtotal + taxTotal;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file.name);
  };

  const handleFormSubmit = async (actionLabel = 'Approve & Save') => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-modal my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Billy.dk Dynamic Invoice Builder</h2>
              <p className="text-xs text-slate-500">Dynamic VAT, Payment Deadlines, & Currencies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Dynamic Configuration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            {/* Currency Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                {fieldLabels.currency || 'Currency'}
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500"
              >
                {currencyList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol ? `${c.symbol} ` : ''}{c.name || c.code} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Deadline Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                {fieldLabels.paymentTerms || 'Payment Deadline'}
              </label>
              <select
                value={paymentDeadline}
                onChange={(e) => setPaymentDeadline(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500"
              >
                {deadlineList.map((pd, idx) => {
                  const val = String(pd.days !== undefined ? pd.days : pd.value || pd.id || idx);
                  const label = pd.label || `${pd.days || 0} days after`;
                  return (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* VAT Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                VAT Option
              </label>
              <select
                value={selectedVat}
                onChange={(e) => setSelectedVat(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500"
              >
                {vatList.map((v, idx) => {
                  const val = String(v.key || v.code || v.id || idx);
                  const label = v.code || v.label || v.description || 'VAT Option';
                  return (
                    <option key={val} value={val}>
                      {label} {v.description ? `(${v.description})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Customer & Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Select Customer
              </label>
              <select
                value={customerName}
                onChange={handleCustomerSelect}
                className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                <option value="">-- Choose Customer --</option>
                {customersList.map((c) => (
                  <option key={c.id || c.name || c.Company_name} value={c.name || c.Company_name}>
                    {c.Company_name || c.name} ({c.email || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Customer Email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@billing.com"
              required
            />

            <Input
              label="Issue Date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />

            <Input
              label="Payment Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Line Items
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleAddItem}
              >
                Add Line Item
              </Button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-1/2">Description</th>
                    <th className="py-2.5 px-3 w-20">Qty</th>
                    <th className="py-2.5 px-3 w-28">Price</th>
                    <th className="py-2.5 px-3 w-20">Tax %</th>
                    <th className="py-2.5 px-3 w-28 text-right">Subtotal</th>
                    <th className="py-2.5 px-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="Service description..."
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(item.id, 'description', e.target.value)
                          }
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(item.id, 'taxRate', e.target.value)}
                          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2 text-right font-bold text-slate-800">
                        ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attachment & Financial Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Attachment PDF / Image
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center">
                <UploadCloud className="w-6 h-6 text-blue-500 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {attachment ? attachment : 'Click to attach file'}
                </span>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT / Tax (25%):</span>
                <span className="font-semibold">${taxTotal.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-200 my-1" />
              <div className="flex justify-between text-slate-900 font-bold text-sm">
                <span>Grand Total ({selectedCurrency}):</span>
                <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {approveButtonsList.length > 0 ? (
              approveButtonsList.map((btn) => (
                <Button
                  key={btn.id || btn.label}
                  variant={btn.id === 3 ? 'primary' : 'outline'}
                  onClick={() => handleFormSubmit(btn.label)}
                >
                  {btn.label}
                </Button>
              ))
            ) : (
              <Button variant="primary" onClick={() => handleFormSubmit()}>
                Approve & Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillyInvoiceModal;
