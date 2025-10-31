import { baseApi } from "@/redux/api/baseApi";

const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceCategory: builder.query({
      query: (args: { name: string; value: any }[]) => {
        const params: Record<string, string | number> = {};
        if (args) {
          args.forEach((item) => {
            params[item.name] = item.value;
          });
        }
        return { url: "/service-cat", method: "GET", params };
      },
      providesTags: ["categories"],
    }),

    createCategory: builder.mutation({
      query: (payload: any) => ({
        url: `/service-cat`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["categories"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, formData }: any) => {
        return {
          url: `/service-cat/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["categories"],
    }),

    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/service-cat/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetAllServiceCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = serviceApi;

export default serviceApi;
