import { baseApi } from "@/redux/api/baseApi";

const videoContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideoContent: builder.query({
      query: (query: Record<string, any>) => ({
        url: "/video-content/get-all",
        method: "GET",
        params: query,
      }),
      providesTags: ["videoContent"],
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
      invalidatesTags: ["videoContent"],
    }),

    updateVideoContent: builder.mutation({
      query: (payload: { id: string; data: any }) => {
        return {
          url: `/video-content/update/${payload.id}`,
          method: "PUT",
          body: payload.data,
        };
      },
      invalidatesTags: ["videoContent"],
    }),

    deleteVideoContent: builder.mutation({
      query: (id) => {
        return {
          url: `/video-content/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["videoContent"],
    }),

    getSingleVideoContent: builder.query({
      query: (id: string) => {
        return {
          url: `/video-content/get-single/${id}`,
          method: "GET",
        };
      },
    }),

    createVideo: builder.mutation({
      query: (body) => {
        console.log("🚀 ~ body:", body);
        return {
          url: "/video/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["videos"],
    }),

    updateVideo: builder.mutation({
      query: (payload: { id: string; data: any }) => {
        return {
          url: `/video/update/${payload.id}`,
          method: "PUT",
          body: payload.data,
        };
      },
      invalidatesTags: ["videos"],
    }),

    getVideoByContentId: builder.query({
      query: (id: string) => {
        return {
          url: `/video/all?parentContent=${id}`,
          method: "GET",
        };
      },
      providesTags: ["videos"],
    }),

    deleteVideo: builder.mutation({
      query: (id) => {
        return {
          url: `/video/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["videos"],
    }),
  }),
});

export const {
  useGetVideoContentQuery,
  useCreateVideoContentMutation,
  useUpdateVideoContentMutation,
  useDeleteVideoContentMutation,

  useGetSingleVideoContentQuery,

  useCreateVideoMutation,
  useUpdateVideoMutation,

  useGetVideoByContentIdQuery,
  useDeleteVideoMutation,
} = videoContentApi;
