import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params?: string) => {
        const queryString = params ? `?searchTerm=${params}` : "";
        return {
          url: `/user/get-all-users${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const { useGetAllUsersQuery, useBlockUserMutation } = userApi;

export default userApi;
