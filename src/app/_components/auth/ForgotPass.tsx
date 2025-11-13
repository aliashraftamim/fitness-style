"use client";

import { useSendOtpForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthForm } from "./AuthForm";

export default function ForgotPass() {
  const [forgotPassword] = useSendOtpForgotPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string | boolean>) => {
    try {
      const res = await forgotPassword({ email: values.email }).unwrap();
      console.log("🚀 ~ ForgotPass response:", res);

      if (res?.success && res?.data?.resetToken) {
        // ✅ Save token in localStorage
        localStorage.setItem("reset_token", res?.data?.resetToken);
        if (values.email) {
          localStorage.setItem("reset_email", values?.email as string);
        }
        toast.success(res?.message || "OTP sent successfully");
        router.push("/otp");
      } else {
        toast.error(res?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthForm
      fields={[
        {
          label: "Email",
          name: "email",
          type: "email",
          placeholder: "your@email.com",
        },
      ]}
      buttonLabel="Get OTP"
      onSubmit={handleSubmit}
      imageLink="/images/auth/basket_ball1.png"
      heading="Forget password"
      description="Enter your email address to get a verification code for resetting your password."
    />
  );
}
