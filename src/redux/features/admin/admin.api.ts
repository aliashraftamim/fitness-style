import { baseApi } from "@/redux/api/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/user/get-me",
        method: "GET",
      }),
      providesTags: ["profileInfo"],
    }),

    updateMe: builder.mutation({
      query: (payload) => ({
        url: "/user/update-me",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["profileInfo"],
    }),

    updateAdmin: builder.mutation({
      query: (payload) => ({
        url: `/user/update-user-info/${payload.id}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["users"],
    }),

    createAdmin: builder.mutation({
      query: (payload) => ({
        url: "/user/create-admin",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),

    getAdmins: builder.query({
      query: (params) => ({
        url: "/user/get-admins",
        method: "GET",
        params,
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateAdminMutation,
  useCreateAdminMutation,
  useGetAdminsQuery,
} = adminApi;
