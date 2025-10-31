"use client";

import { useSendOtpForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { useState } from "react";
import { AuthForm } from "./AuthForm";

export default function ForgotPass() {
  const [forgotPassword] = useSendOtpForgotPasswordMutation();

  const [email, setEmail] = useState("");

  const handleSubmit = async (values: Record<string, string | boolean>) => {
    console.log("Login Values:", values);

    const res = await forgotPassword({ email: values.email }).unwrap();
    console.log("🚀 ~ handleSubmit ~ res:", res);
  };

  return (
    <>
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
        description="Enter your email address to ger a verification code for resetting your password."
        btnLink="/otp"
      />
    </>
  );
}
