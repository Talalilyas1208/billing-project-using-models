import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../common/Button';

export default function InvoiceHeader({ onBack }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" icon={ArrowLeft} onClick={onBack}>
          Back
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Invoice</h1>
          <p className="text-xs text-slate-500">Fill in invoice details, select customer, and add line items</p>
        </div>
      </div>
    </div>
  );
}
