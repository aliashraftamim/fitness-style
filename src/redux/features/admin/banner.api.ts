import { baseApi } from "@/redux/api/baseApi";

const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: () => ({
        url: "/banner",
        method: "GET",
      }),
      providesTags: ["banners"],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banners"],
    }),

    createBanner: builder.mutation({
      query: (payload) => ({
        url: "/banner",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["banners"],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useDeleteBannerMutation,
  useCreateBannerMutation,
} = bannerApi;

export default bannerApi;
