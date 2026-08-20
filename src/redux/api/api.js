import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";

/**
 * Main RTK Query API Slice with Redux-Persist & Tag-Based Cache Invalidation
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),

  // 1. PERSISTENCE REHYDRATION HANDLER (redux-persist integration)
  // Extracts persisted cache state on app startup or page refresh
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },

  // 2. HTTP FETCH CACHE OVERRIDE
  // Ensures fresh network fetches without browser disk cache interference
  fetchFn: (input, init) => fetch(input, { ...init, cache: "no-store" }),

  // 3. AUTO-REFETCH ON NETWORK RECONNECT
  refetchOnReconnect: true,

  // 4. CACHE TAG REGISTRY (Used for automatic UI re-renders on mutation updates)
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
    "Company",
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
    getCompanyData: builder.query({
      query: () => "/api/companydata",
      providesTags: [{ type: "Company", id: "DETAIL" }],
    }),
    getInvoices: builder.query({
      query: () => "/api/invoice",
      providesTags: [{ type: "Invoice", id: "LIST" }],
    }),

    // MUTATIONS WITH AUTOMATIC CACHE INVALIDATION
    // When addInvoice, updateInvoice, or deleteInvoice run, invalidatesTags triggers refetch of getInvoices!
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
  useGetCompanyDataQuery,
  useGetInvoicesQuery,
  useAddInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = api;
