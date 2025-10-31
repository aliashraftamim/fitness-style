import { baseApi } from "@/redux/api/baseApi";

const notificationAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "/notification",
        method: "GET",
      }),
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notification/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const { useGetNotificationsQuery, useDeleteNotificationMutation } =
  notificationAPi;

export default notificationAPi;
