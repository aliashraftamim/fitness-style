import { baseApi } from "@/redux/api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscription: builder.query({
      query: () => {
        return { url: "/subscription/all", method: "GET" };
      },
      providesTags: ["subscriptions"],
    }),

    getSingleSubscription: builder.query({
      query: (id) => {
        return {
          url: `/subscription/single/${id}`,
          method: "GET",
        };
      },
      providesTags: ["subscriptions"],
    }),

    createSubscription: builder.mutation({
      query: (body) => {
        return {
          url: "/subscription/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["subscriptions"],
    }),

    updateSubscription: builder.mutation({
      query: (body: any) => {
        const { id, ...data } = body;

        return {
          url: `/subscription/update/${id}`,
          method: "PUT",
          body: body.data,
        };
      },
      invalidatesTags: ["subscriptions"],
    }),

    deleteSubscription: builder.mutation({
      query: (id: string) => {
        return {
          url: `/subscription/update/${id}`,
          method: "PUT",
          body: { isDeleted: true },
        };
      },
      invalidatesTags: ["subscriptions"],
    }),

    makeAUserPremium: builder.mutation({
      query: (params: {
        userId: string;
        subscriptionType: "premium" | "enterprise" | "vip";
      }) => {
        return {
          url: `/subscription/pay-by-admin`,
          body: params,
          method: "POST",
        };
      },
      invalidatesTags: ["subscriptions"],
    }),
  }),
});

export const {
  useGetAllSubscriptionQuery,
  useGetSingleSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useMakeAUserPremiumMutation,
  useCreateSubscriptionMutation,
} = subscriptionApi;
