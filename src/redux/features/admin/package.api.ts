import { baseApi } from "@/redux/api/baseApi";

const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPackage: builder.query({
      query: () => ({
        url: "/package",
      }),
      providesTags: ["packages"],
    }),

    // Mutation to create a new package
    createPackage: builder.mutation({
      query: (payload) => ({
        url: "/package",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["packages"],
    }),

    updatePackage: builder.mutation({
      query: (payload: any) => {

        return {
          url: `/package/${payload?.id}`,
          method: "PATCH",
          body: payload?.data,
        };
      },
      invalidatesTags: ["packages"],
    }),
    deletePackage: builder.mutation({
      query: (id: string) => ({
        url: `/package/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["packages"],
    }),
  }),
});

export const {
  useGetAllPackageQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
