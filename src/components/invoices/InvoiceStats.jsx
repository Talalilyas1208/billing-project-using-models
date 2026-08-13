import React from 'react';
import { DollarSign, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const InvoiceStats = ({ invoices = [] }) => {
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalPending = invoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((acc, inv) => acc + inv.grandTotal, 0);

  const stats = [
    {
      title: 'Total Invoiced',
      amount: `$${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: `${invoices.length} total invoices`,
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Paid Revenue',
      amount: `$${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: `${invoices.filter((i) => i.status === 'Paid').length} paid`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Pending Amount',
      amount: `$${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: `${invoices.filter((i) => i.status === 'Pending').length} awaiting payment`,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Overdue Amount',
      amount: `$${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: `${invoices.filter((i) => i.status === 'Overdue').length} overdue`,
      icon: AlertTriangle,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between transition-hover hover:border-slate-300"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{stat.amount}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.subtitle}</p>
            </div>
            <div className={`p-3 rounded-xl border ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvoiceStats;
