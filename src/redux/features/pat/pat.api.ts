import { baseApi } from "@/redux/api/baseApi";

const patApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePrivacy: builder.mutation({
      query: (payload) => ({
        url: "/pat/privacy",
        method: "PUT",
        body: payload,
      }),
    }),
    updateTerms: builder.mutation({
      query: (payload) => ({
        url: "/pat/terms",
        method: "PUT",
        body: payload,
      }),
    }),
    updateAboutUs: builder.mutation({
      query: (payload) => ({
        url: "/pat/about",
        method: "PUT",
        body: payload,
      }),
    }),
    getTerms: builder.query({
      query: () => ({
        url: "/pat/terms",
      }),
    }),
    getPrivacy: builder.query({
      query: () => ({
        url: "/pat/privacy",
      }),
    }),
    getAbout: builder.query({
      query: () => ({
        url: "/pat/about",
      }),
    }),
  }),
});

export const {
  useUpdatePrivacyMutation,
  useUpdateTermsMutation,
  useUpdateAboutUsMutation,
  useGetTermsQuery,
  useGetPrivacyQuery,
  useGetAboutQuery,
} = patApi;
