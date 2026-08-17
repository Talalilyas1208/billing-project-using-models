import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },
  fetchFn: (input, init) => fetch(input, { ...init, cache: "no-store" }),
  refetchOnReconnect: true,
  tagTypes: [
    "Sidebar",
    "Currency",
    "Revenue",
    "FieldType",
    "Language",
    "Vat",
    "PaymentDeadline",
    "PriceModeOptions",
    "DesignOptions",
    "Approvebutton",
    "Invoice",
  ],
  endpoints: (builder) => ({
    getSidebar: builder.query({
      query: () => "/api/sidebar",
      providesTags: [{ type: "Sidebar", id: "LIST" }],
    }),
    getCurrencies: builder.query({
      query: ({ limit = 0 } = {}) =>
        limit ? `/api/currency?limit=${limit}` : "/api/currency",
      providesTags: [{ type: "Currency", id: "LIST" }],
    }),
    getRevenueCategories: builder.query({
      query: () => "/api/revnue",
      providesTags: [{ type: "Revenue", id: "LIST" }],
    }),
    getFieldTypeOptions: builder.query({
      query: () => "/api/labelforfield",
      providesTags: [{ type: "FieldType", id: "LIST" }],
    }),
    getLanguages: builder.query({
      query: () => "/api/Language",
      providesTags: [{ type: "Language", id: "LIST" }],
    }),
    getVat: builder.query({
      query: () => "/api/vat",
      providesTags: [{ type: "Vat", id: "LIST" }],
    }),
    getPaymentDeadlines: builder.query({
      query: () => "/api/paymentdeadline",
      providesTags: [{ type: "PaymentDeadline", id: "LIST" }],
    }),
    getPriceModeOptions: builder.query({
      query: () => "/api/priceModeOptions",
      providesTags: [{ type: "PriceModeOptions", id: "LIST" }],
    }),
    getDesignOptions: builder.query({
      query: () => "/api/designOptions",
      providesTags: [{ type: "DesignOptions", id: "LIST" }],
    }),
    getapprovebutton: builder.query({
      query: () => "/api/approvebutton",
      providesTags: [{ type: "Approvebutton", id: "List" }],
    }),
    getInvoices: builder.query({
      query: () => "/api/invoice",
      providesTags: [{ type: "Invoice", id: "LIST" }],
    }),
    addInvoice: builder.mutation({
      query: (invoiceData) => ({
        url: "/api/invoice",
        method: "POST",
        body: invoiceData,
      }),
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),
    updateInvoice: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/api/invoice/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/api/invoice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSidebarQuery,
  useGetCurrenciesQuery,
  useGetRevenueCategoriesQuery,
  useGetFieldTypeOptionsQuery,
  useGetLanguagesQuery,
  useGetVatQuery,
  useGetPaymentDeadlinesQuery,
  useGetPriceModeOptionsQuery,
  useGetDesignOptionsQuery,
  useGetapprovebuttonQuery,
  useGetInvoicesQuery,
  useAddInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = api;
