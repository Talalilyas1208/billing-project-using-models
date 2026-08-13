import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blackListApi = createApi({
  reducerPath: "blackListApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["Customer", "Products", "Columns"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ search = "", page = 1, limit = 10 } = {}) =>
        `/api/customer?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data
          ? [
              { type: "Customer", id: "LIST" },
              ...result.data.map((item) => ({ type: "Customer", id: item.id })),
            ]
          : [{ type: "Customer", id: "LIST" }],
    }),
    addCustomer: builder.mutation({
      query: (customer) => ({
        url: "/api/customer",
        method: "POST",
        body: customer,
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    getProducts: builder.query({
      query: ({ search = "", page = 1, limit = 10 } = {}) =>
        `/api/products?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
      refetchOnMountOrArgChange: false,

      providesTags: (result) =>
        result?.data
          ? [
              { type: "Products", id: "LIST" },
              ...result.data.map((item) => ({ type: "Products", id: item.id })),
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: "/api/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    deleteColumn: builder.mutation({
      query: (id) => ({
        url: `/api/columns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Columns", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteColumnMutation,
} = blackListApi;
