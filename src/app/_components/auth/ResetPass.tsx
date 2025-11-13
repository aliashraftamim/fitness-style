"use client";

import { useResetForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthForm } from "./AuthForm";

const ResetPass = () => {
  const [resetPass] = useResetForgotPasswordMutation();

  const router = useRouter();

  const handleSubmit = async (values: Record<string, string | boolean>) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    const token = localStorage.getItem("reset_token"); // 🔹 token from previous step
    console.log("🚀 ~ handleSubmit ~ token:", token);
    if (!token) {
      toast.error("Missing token. Please restart the process.");
      router.push("/forgot-pass");
      return;
    }

    try {
      const res = await resetPass({
        resetToken: token,
        newPassword: values.newPassword as string,
        confirmPassword: values.confirmPassword as string,
      }).unwrap();
      console.log("🚀 ~ handleSubmit ~ res:", res);

      console.log("✅ OTP verify response:", res);

      if (res?.success && res?.data?.resetToken) {
        localStorage.removeItem("reset_token");
        localStorage.setItem("reset_token", res?.data?.resetToken);
      }

      if (!res?.success) {
        toast.error(res?.message || "OTP verification failed!");
        router.push("/forgot-pass");
        return;
      }

      toast.success(res?.message || "OTP verified successfully!");

      router.push("/login"); // redirect to reset password page
    } catch (error: any) {
      toast.error(error?.data?.message || "OTP verification failed!");
      console.error("❌ OTP verify error:", error);
    }
  };
  return (
    <div>
      <AuthForm
        fields={[
          { label: "New Password", name: "newPassword", type: "password" },
          {
            label: "COnfirm Password",
            name: "confirmPassword",
            type: "password",
          },
        ]}
        buttonLabel="Update Password"
        onSubmit={handleSubmit}
        imageLink="/images/auth/run_couple.png"
        heading="Set new password"
        description="New Password"
      />
    </div>
  );
};

export default ResetPass;
