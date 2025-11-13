"use client";

import { AuthForm } from "@/app/_components/auth/AuthForm";
import {
  useSendOtpForgotPasswordMutation,
  useVerifyResetOTPMutation,
} from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { OtpInputGroup } from "../ui/OtpInputGroup";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [verifyOtp] = useVerifyResetOTPMutation();
  const [forgotPassword, { isLoading: resendLoading }] =
    useSendOtpForgotPasswordMutation();
  const router = useRouter();

  const resendMail = localStorage.getItem("reset_email");

  // 🔹 OTP verify handler
  const handleSubmit = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter the full OTP code");
      return;
    }

    const token = localStorage.getItem("reset_token");
    if (!token) {
      toast.error("Missing token. Please restart the process.");
      router.push("/forgot-pass");
      return;
    }

    try {
      const res = await verifyOtp({
        otp,
        resetToken: token,
      }).unwrap();

      console.log("✅ OTP verify response:", res);

      if (res?.success && res?.data?.resetToken) {
        localStorage.setItem("reset_token", res.data.resetToken);
        toast.success(res?.message || "OTP verified successfully!");
        router.push("/reset-pass");
      } else {
        toast.error(res?.message || "OTP verification failed!");
      }
    } catch (error: any) {
      console.error("❌ OTP verify error:", error);
      toast.error(error?.data?.message || "OTP verification failed!");
    }
  };

  // 🔹 Resend OTP handler
  const handleResend = async () => {
    if (!resendMail) {
      toast.error("Missing email. Please restart the process.");
      router.push("/forgot-pass");
      return;
    }

    try {
      const res = await forgotPassword({ email: resendMail }).unwrap();
      if (res?.success && res?.data?.resetToken) {
        toast.success("OTP resent successfully!");
        localStorage.setItem("reset_token", res?.data?.resetToken);
      } else {
        toast.error(res?.message || "Failed to resend OTP!");
      }
    } catch (error: any) {
      console.error("❌ Resend OTP error:", error);
      toast.error(error?.data?.message || "Failed to resend OTP!");
    }
  };

  return (
    <div>
      <AuthForm
        buttonLabel="Verify OTP"
        onSubmit={handleSubmit}
        imageLink="/images/auth/basket_ball2.png"
        heading="Verify OTP"
        description={`Please check your email. We have sent a code to ${resendMail}`}
        extraContent={
          <>
            <OtpInputGroup length={4} onChange={(val: string) => setOtp(val)} />

            <div className="flex justify-between pt-3">
              <p className="mt-4 text-sm text-gray-600">Didn’t receive code?</p>
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-blue-600 hover:underline text-sm mt-1 disabled:opacity-50"
              >
                {resendLoading ? "Resending..." : "Resend"}
              </button>
            </div>
          </>
        }
      />
    </div>
  );
};

export default Otp;
