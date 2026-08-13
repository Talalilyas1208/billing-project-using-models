import React from 'react';
import { FileCheck, Plus } from 'lucide-react';
import Button from '../components/common/Button';
import { useGetProductsQuery } from '../redux/api/blackListApi';

const OffersPage = () => {
  const { data: response = {}, isLoading } = useGetProductsQuery({ page: 1, limit: 10 });
  const products = Array.isArray(response) ? response : response.data || [];

  const offers = products.map((p, index) => ({
    id: `OFF-2026-10${index + 1}`,
    customer: p.supplier !== "12" ? p.supplier : 'Acme Corporation',
    title: p.description !== "12" ? p.description : 'Enterprise Solution Package',
    total: Number(p.price || 0) * 1.5,
    validUntil: '2026-09-15',
    status: index % 2 === 0 ? 'Accepted' : 'Sent',
    currency: p.currency || 'USD',
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-600" />
            Quotations & Offers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic offer data loaded via RTK Query API
          </p>
        </div>
        <Button variant="primary" icon={Plus}>
          New Quotation
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Offer ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Valid Until</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 animate-pulse">
                  Loading dynamic offers...
                </td>
              </tr>
            ) : offers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No offer records found.
                </td>
              </tr>
            ) : (
              offers.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-blue-600">{o.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{o.customer}</td>
                  <td className="py-3 px-4 text-slate-600">{o.title}</td>
                  <td className="py-3 px-4 text-slate-500">{o.validUntil}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      o.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    ${o.total.toFixed(2)} ({o.currency})
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OffersPage;
