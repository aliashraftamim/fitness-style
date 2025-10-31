import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: userInfo,
        };
      },
    }),

    sendOtpForgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    verifyResetOTP: builder.mutation({
      query: (payload: { otp: string; resetToken: string }) => ({
        url: "/auth/verify-otp",
        method: "PATCH",
        body: { otp: payload?.otp },
        headers: {
          "Content-Type": "application/json",
          Authorization: payload.resetToken,
        },
      }),
    }),

    resetForgotPassword: builder.mutation({
      query: (payload: {
        resetToken: string;
        newPassword: string;
        confirmPassword: string;
      }) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body: {
          newPassword: payload?.newPassword,
          confirmPassword: payload?.confirmPassword,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: payload.resetToken,
        },
      }),
    }),

    changeMyPassword: builder.mutation({
      query: (payload: { oldPassword: string; newPassword: string }) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: payload,
      }),
    }),

    getMe: builder.query({
      query: () => ({
        url: "/user/get-me",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpForgotPasswordMutation,
  useVerifyResetOTPMutation,
  useResetForgotPasswordMutation,

  useChangeMyPasswordMutation,

  useGetMeQuery,
} = authApi;
