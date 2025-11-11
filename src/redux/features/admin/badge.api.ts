import { baseApi } from "@/redux/api/baseApi";

const badgeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBadges: builder.query({
      query: (query: Record<string, any>) => {
        // ✅ remove empty fields (like undefined, null, "", etc.)
        const filteredQuery: Record<string, any> = {};

        Object.keys(query || {}).forEach((key) => {
          const value = query[key];
          if (value !== undefined && value !== null && value !== "") {
            filteredQuery[key] = value;
          }
        });

        return {
          url: "/badge/all",
          method: "GET",
          params: filteredQuery, // ✅ only non-empty params
        };
      },
      providesTags: ["badges"],
    }),

    createBadge: builder.mutation({
      query: (body) => ({
        url: "/badge/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["badges"],
    }),

    blockBadge: builder.mutation({
      query: (id) => ({
        url: `/badge/block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["badges"],
    }),

    unblockBadge: builder.mutation({
      query: (id) => ({
        url: `/badge/unblock/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["badges"],
    }),
  }),
});

export const {
  useGetBadgesQuery,
  useCreateBadgeMutation,
  useBlockBadgeMutation,
  useUnblockBadgeMutation,
} = badgeApi;
