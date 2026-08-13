import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

const mockSidebarData = [
  {
    id: 1,
    label: 'Invoicing',
    path: '/dashboard',
    children: [
      { name: 'Invoice', link: '/dashboard/invoices' },
      { name: 'Products', link: '/dashboard/products' },
      { name: 'Offers', link: '/dashboard/offers' },
      { name: 'contact', link: '/dashboard/contact' },
      { name: 'Customer', link: '/dashboard/Customer' },
    ],
  },
];

export const sidebarApi = createApi({
  reducerPath: 'sidebarApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getSidebar: builder.query({
      queryFn: async () => {
        // Simulate real-time API fetch
        return { data: mockSidebarData };
      },
    }),
  }),
});

export const { useGetSidebarQuery } = sidebarApi;
