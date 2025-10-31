import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params?: string) => {
        const queryString = params ? `?searchTerm=${params}` : "";
        return {
          url: `/dashboard/user/all-users${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `/user/block-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const { useGetAllUsersQuery, useBlockUserMutation } = userApi;

export default userApi;
