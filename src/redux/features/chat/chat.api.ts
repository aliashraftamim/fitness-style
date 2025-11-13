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
      query: (payload: { id: string; query: Record<string, any> }) => ({
        url: `/chatting/private/${payload.id}`,
        method: "GET",
        params: payload.query,
      }),
    }),

    sendImage: builder.mutation({
      query: (payload: { id: string; data: FormData }) => ({
        url: `/chatting/send-files-to-customer/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
    }),
  }),
});

export const {
  useGetSupportCustomersQuery,
  useGetACustomerChatQuery,
  useSendImageMutation,
} = chatApi;
