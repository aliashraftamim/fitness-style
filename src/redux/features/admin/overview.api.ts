import { baseApi } from "@/redux/api/baseApi";

const dashboardOverview = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: () => ({
        url: "/dashboard/home/top",
        method: "GET",
      }),
    }),

    getEarningChart: builder.query({
      query: (params) => {
        return {
          url: `/dashboard/home/earning-chart?year=${params}`,
          method: "GET",
        };
      },
    }),

    getUserEntryChart: builder.query({
      query: (params) => {
        return {
          url: `/dashboard/home/monthly-user-chart`,
          method: "GET",
        };
      },
    }),

    getMonthlyTotalProductChart: builder.query({
      query: (params) => {
        return {
          url: `/dashboard/home/monthly-items-chart`,
          method: "GET",
        };
      },
    }),

    getCountryTrafficTracker: builder.query({
      query: (params) => {
        return {
          url: `/dashboard/home/country-tracker`,
          method: "GET",
        };
      },
    }),

    getRecentUser: builder.query({
      query: (params) => {
        return {
          url: `/dashboard/home/recent-users`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetEarningChartQuery,
  useGetUserEntryChartQuery,
  useGetMonthlyTotalProductChartQuery,
  useGetCountryTrafficTrackerQuery,
  useGetRecentUserQuery,
} = dashboardOverview;
