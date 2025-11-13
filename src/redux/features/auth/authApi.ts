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
        url: "/auth/verify-otp-for-forgot-password",
        method: "POST",
        body: { otp: payload?.otp },
        headers: {
          "Content-Type": "application/json",
          token: payload.resetToken,
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
        method: "POST",
        body: {
          newPassword: payload?.newPassword,
          confirmPassword: payload?.confirmPassword,
        },
        headers: {
          "Content-Type": "application/json",
          token: payload.resetToken,
        },
      }),
    }),

    changeMyPassword: builder.mutation({
      query: (payload: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
      }) => ({
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
