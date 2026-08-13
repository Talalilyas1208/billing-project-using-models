import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useGetCustomersQuery } from '../../redux/api/blackListApi';

const DataManagerTable = ({ columns = [], title = 'Customers Table' }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response = {}, isLoading } = useGetCustomersQuery({ page, limit, search });

  const items = response.data || (Array.isArray(response) ? response : []);
  const totalPages = response.totalPages || 1;
  const totalItems = response.total || items.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {title} ({totalItems})
        </h3>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-slate-400 animate-pulse">
                  Loading data via blackListApi...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                  No customer records found.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? 'N/A')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <span>
          Page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong>
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="p-1.5 border border-slate-200 bg-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="p-1.5 border border-slate-200 bg-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagerTable;
