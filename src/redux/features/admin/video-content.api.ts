import { baseApi } from "@/redux/api/baseApi";

const videoContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideoContent: builder.query({
      query: () => ({
        url: "/video-content/get-all",
        method: "GET",
      }),
    }),

    createVideoContent: builder.mutation({
      query: (body) => {
        console.log("🚀 ~ body:", body);
        return {
          url: "/video-content/create",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useGetVideoContentQuery, useCreateVideoContentMutation } =
  videoContentApi;
