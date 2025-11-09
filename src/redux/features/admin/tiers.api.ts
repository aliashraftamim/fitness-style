import { baseApi } from "@/redux/api/baseApi";

const tiersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTiers: builder.query({
      query: () => ({
        url: "/tiers",
        method: "GET",
      }),
    }),
  }),
});
