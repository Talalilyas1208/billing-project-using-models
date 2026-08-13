import React from 'react';

const Badge = ({ status }) => {
  const styles = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dots = {
    Paid: 'bg-emerald-500',
    Pending: 'bg-amber-500',
    Overdue: 'bg-rose-500',
    Draft: 'bg-slate-400',
  };

  const currentStyle = styles[status] || styles.Draft;
  const currentDot = dots[status] || dots.Draft;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${currentStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${currentDot}`} />
      {status}
    </span>
  );
};

export default Badge;
