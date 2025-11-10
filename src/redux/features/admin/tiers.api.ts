import { baseApi } from "@/redux/api/baseApi";

const tiersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTiers: builder.query({
      query: () => ({
        url: "/tiers",
        method: "GET",
      }),
      providesTags: ["tiers"],
    }),

    updateTier: builder.mutation({
      query: (payload) => ({
        url: `/tiers/update/${payload.id}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["tiers"],
    }),

    addTier: builder.mutation({
      query: (payload) => ({
        url: "/tiers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["tiers"],
    }),

    deleteTier: builder.mutation({
      query: (id) => ({
        url: `/tiers/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tiers"],
    }),
  }),
});

export const {
  useGetAllTiersQuery,
  useUpdateTierMutation,
  useAddTierMutation,
  useDeleteTierMutation,
} = tiersApi;
