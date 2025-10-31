import { baseApi } from "@/redux/api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscription: builder.query({
      query: () => {
        return { url: "/subscription", method: "GET" };
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

    updateAndDelete: builder.mutation({
      query: (body: any) => {
        const { id, ...data } = body;

        return {
          url: `/subscription/${id}`,
          method: "PUT",
          body: data.body,
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
  useUpdateAndDeleteMutation,
  useMakeAUserPremiumMutation,
} = subscriptionApi;
