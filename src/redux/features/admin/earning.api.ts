import { baseApi } from "@/redux/api/baseApi";

const earningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopPrimaryEarning: builder.query({
      query: () => ({
        url: "/dashboard/earnings/top-overview",
        method: "GET",
      }),
    }),
    getAllEarnings: builder.query({
      query: (params) => ({
        url: params
          ? `/dashboard/earnings/user-earnings?searchTerm=${params}`
          : `/dashboard/earnings/user-earnings`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTopPrimaryEarningQuery, useGetAllEarningsQuery } =
  earningApi;

export default earningApi;
