import React, { useState } from 'react';
import { Users, Building, Mail, UserPlus, Plus } from 'lucide-react';
import { Form } from 'antd';
import { useGetCustomersQuery } from '../redux/api/blackListApi';
import Modals from '../components/Modal';
import NewCustomers from '../components/NewCustomers/NewCustomers';
import Button from '../components/common/Button';

const CustomerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const {
    data: response = {},
    isLoading,
    refetch: refetchCustomers,
  } = useGetCustomersQuery({ page: 1, limit: 10 });

  const customers = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : [];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (refetchCustomers) refetchCustomers();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Create Customer Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your client profiles, billing emails, and customer directory
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenModal}
        >
          Create Customer
        </Button>
      </div>

      {/* Create Customer Modal */}
      <Modals
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        rest={{
          title: "Create New Customer",
          width: 700,
          destroyOnClose: true,
        }}
      >
        <NewCustomers
          refetchCustomers={refetchCustomers}
          onClose={handleCloseModal}
          form={form}
        />
      </Modals>

      {/* Customers Table */}
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
                  Loading customer directory...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">No customers found</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You haven't added any customers yet. Click below to add your first customer.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={UserPlus}
                    onClick={handleOpenModal}
                    className="mx-auto"
                  >
                    Create First Customer
                  </Button>
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-600 truncate max-w-[120px]">
                    {String(c.id).slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.Company_name || c.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{c.country || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
