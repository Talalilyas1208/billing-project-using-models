import React from 'react';
import { Users, Building, Mail } from 'lucide-react';
import { useGetCustomersQuery } from '../redux/api/blackListApi';

const CustomerPage = () => {
  const { data: response = {}, isLoading } = useGetCustomersQuery({ page: 1, limit: 10 });
  const customers = Array.isArray(response) ? response : response.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Customer Directory (blackListApi)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Consuming useGetCustomersQuery from blackListApi
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Company Name</th>
              <th className="py-3 px-4">Billing Email</th>
              <th className="py-3 px-4">Country</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 animate-pulse">
                  Loading customers via blackListApi...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No customer records found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-blue-600">{c.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{c.country || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      {c.status || 'Active'}
                    </span>
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

export default CustomerPage;
