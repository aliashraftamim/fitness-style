"use client";

import { useEffect, useRef, useState } from "react";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import UpdatePassword from "./UpdatePassword";

const VerifyOTP = ({ setOpen, setIsVerifyMail, resetToken }: any) => {
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const otpLength = 4; // OTP length
  const [otp, setOtp] = useState(Array(otpLength).fill("")); // OTP array
  const inputRefs = useRef<HTMLInputElement[]>([]); // Refs for OTP input fields
  const [error, setError] = useState(""); // Error message state
  // const [verifyResetOTP] = useVerifyResetOTPMutation();

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value) && value !== "") {
      return;
    } // Only allow single digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input field if value is entered
    if (value && index < otpLength - 1) {
      const nextInput = inputRefs.current[index + 1];
      nextInput?.focus();
      nextInput?.setSelectionRange(
        nextInput.value.length,
        nextInput.value.length
      );
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const myOTP = otp.join("");
    if (myOTP.length !== otpLength) {
      setError(`OTP must be ${otpLength} characters long.`);
      return;
    }

    try {
      // const res = await verifyResetOTP({
      //   otp: myOTP,
      //   resetToken,
      // }).unwrap();
      // if (res.success) {
      //   setIsUpdatePassword(true);
      // } else {
      //   setError(res.message || "Invalid OTP. Please try again.");
      // }
    } catch (error: any) {
      setError(error.data?.message || "Something went wrong. Try again.");
    }
  };

  // Handle OTP Resend action
  const handleResendOTP = () => {
    setOtp(Array(otpLength).fill("")); // Clear OTP values
    setError(""); // Clear any existing error
    inputRefs.current[0]?.focus(); // Refocus on the first input
  };

  // Handle pasting full OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pastedData) || pastedData.length !== otpLength) {
      return;
    }

    const newOtp = pastedData.split("").slice(0, otpLength);
    setOtp(newOtp);

    // Move focus to last filled input
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    inputRefs.current[
      nextEmptyIndex !== -1 ? nextEmptyIndex : otpLength - 1
    ]?.focus();
  };

  // Auto-submit OTP when all fields are filled
  useEffect(() => {
    if (otp.join("").length === otpLength) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div>
      {!isUpdatePassword ? (
        <div className="w-[484px] px-6 pb-6 text-center">
          <span className="flex items-center gap-3">
            <HiOutlineArrowSmLeft
              onClick={() => setIsVerifyMail(false)}
              className="hover:cursor-pointer"
              size={30}
            />
            <h2 className="font-medium">Verify Email</h2>
          </span>
          <p className="text-gray-500 mt-1">
            Please enter the OTP we have sent to your email.
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {otp.map((value, index) => (
              <input
                key={index}
                //@ts-ignore
                ref={(el) =>
                  (inputRefs.current[index] = el as HTMLInputElement)
                }
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined} // Handle paste only on first input
                className={`w-[56px] h-[56px] text-center border rounded-md ${
                  value ? "border-green-500" : "border-gray-400"
                }`}
              />
            ))}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-3 text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="text-green-600 font-semibold underline"
              onClick={handleResendOTP}
            >
              Resend
            </button>
          </div>
          <button
            type="button"
            onClick={handleVerify}
            disabled={otp.join("").length !== otpLength}
            className={`w-full h-[56px] mt-5 text-white font-semibold ${
              otp.join("").length === otpLength
                ? "bg-[#FF4F00]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Verify
          </button>
        </div>
      ) : (
        <UpdatePassword
          setOpen={setOpen}
          setIsUpdatePassword={setIsUpdatePassword}
        />
      )}
    </div>
  );
};

export default VerifyOTP;
