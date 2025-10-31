import { baseApi } from "@/redux/api/baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/notification",
          method: "GET",
          params,
        };
      },
    }),
    readAllNotification: builder.mutation({
      query: () => ({
        url: "/notification/read-all-notification",
        method: "PUT",
      }),
    }),
  }),
});

export const { useGetNotificationQuery, useReadAllNotificationMutation } =
  notificationApi;
