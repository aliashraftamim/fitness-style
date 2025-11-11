"use client";

import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params: Record<string, any> = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `/user/get-all-users${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),

    getPaidUsers: builder.query({
      query: (params: Record<string, any> = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `/user/paid-users${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `/user/block-unblock-user/${id}`,
        method: "PATCH",
        body: { isBlocked: true },
      }),
      invalidatesTags: ["users"],
    }),

    unblockUser: builder.mutation({
      query: (id) => ({
        url: `/user/block-unblock-user/${id}`,
        method: "PATCH",
        body: { isBlocked: false },
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetPaidUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} = userApi;

export default userApi;
