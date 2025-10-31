import { baseApi } from "@/redux/api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: (args: { name: string; value: any }[]) => {
        const params: Record<string, string | number> = {};
        if (args) {
          args.forEach((item) => {
            params[item.name] = item.value;
          });
        }
        return { url: "/product-cat", method: "GET", params };
      },
      providesTags: ["categories"],
    }),

    createCategory: builder.mutation({
      query: (payload: any) => ({
        url: `/product-cat`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["categories"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, formData }: any) => {
        return {
          url: `/product-cat/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["categories"],
    }),

    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/product-cat/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
