import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

let initialInvoices = [
  {
    id: 'INV-2026-001',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    status: 'Paid',
    items: [
      { id: 1, description: 'Web Development & UI Design', quantity: 1, unitPrice: 2450.0, taxRate: 25 },
      { id: 2, description: 'Cloud Infrastructure Setup', quantity: 2, unitPrice: 350.0, taxRate: 25 },
    ],
    subtotal: 3150.0,
    taxTotal: 787.5,
    grandTotal: 3937.5,
    attachment: 'service_agreement.pdf',
  },
  {
    id: 'INV-2026-002',
    customerName: 'Nordic Tech Solutions Solutions AB',
    customerEmail: 'accounts@nordictech.se',
    issueDate: '2026-08-05',
    dueDate: '2026-08-19',
    status: 'Pending',
    items: [
      { id: 1, description: 'Monthly Retainer - Maintenance', quantity: 1, unitPrice: 1200.0, taxRate: 25 },
    ],
    subtotal: 1200.0,
    taxTotal: 300.0,
    grandTotal: 1500.0,
    attachment: null,
  },
  {
    id: 'INV-2026-003',
    customerName: 'Copenhagen Design House',
    customerEmail: 'finance@cphdesign.dk',
    issueDate: '2026-07-20',
    dueDate: '2026-08-03',
    status: 'Overdue',
    items: [
      { id: 1, description: 'E-commerce API Integration', quantity: 1, unitPrice: 1800.0, taxRate: 25 },
    ],
    subtotal: 1800.0,
    taxTotal: 450.0,
    grandTotal: 2250.0,
    attachment: 'invoice_specification.png',
  },
];

export const invoicesApi = createApi({
  reducerPath: 'invoicesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Invoices'],
  endpoints: (builder) => ({
    getInvoices: builder.query({
      queryFn: async () => {
        return { data: [...initialInvoices] };
      },
      providesTags: ['Invoices'],
    }),
    addInvoice: builder.mutation({
      queryFn: async (newInvoice) => {
        initialInvoices = [newInvoice, ...initialInvoices];
        return { data: newInvoice };
      },
      invalidatesTags: ['Invoices'],
    }),
    deleteInvoice: builder.mutation({
      queryFn: async (id) => {
        initialInvoices = initialInvoices.filter((inv) => inv.id !== id);
        return { data: id };
      },
      invalidatesTags: ['Invoices'],
    }),
    updateInvoiceStatus: builder.mutation({
      queryFn: async ({ id, status }) => {
        initialInvoices = initialInvoices.map((inv) =>
          inv.id === id ? { ...inv, status } : inv
        );
        return { data: { id, status } };
      },
      invalidatesTags: ['Invoices'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useAddInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceStatusMutation,
} = invoicesApi;
