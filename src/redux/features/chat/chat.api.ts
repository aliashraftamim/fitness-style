import { baseApi } from "@/redux/api/baseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportCustomers: builder.query({
      query: () => ({
        url: "/chatting/partners",
        method: "GET",
      }),
    }),

    getACustomerChat: builder.query({
      query: (id: string) => ({
        url: `/chatting/private/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSupportCustomersQuery, useGetACustomerChatQuery } =
  chatApi;
