"use client";

import { useChangeMyPasswordMutation } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, Input, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { RiLock2Line } from "react-icons/ri";
import { toast } from "sonner";
import ForgotPassword from "./ForgotPasswordModal";

interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal = ({ open, setOpen }: any) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const mutation = useAppDispatch();
  const [changePassword] = useChangeMyPasswordMutation();

  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<IChangePassword>();

  const onSubmit: SubmitHandler<IChangePassword> = async (data) => {
    const { oldPassword, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const res = await changePassword({
      oldPassword,
      newPassword,
      confirmPassword,
    }).unwrap();

    if (res.success) {
      toast.success("Password changed successfully");
      mutation(logout());
      router.push("/login");
    }
  };

  const handleForgotPasswordToggle = () => {
    setIsForgotPassword(true);
  };

  return (
    <Modal
      title={null}
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      className="mt-32"
    >
      {/* Change Password */}
      {!isForgotPassword ? (
        <div className="w-[484px] px-6 pb-6 py-10">
          <span className="flex items-center gap-3">
            <HiOutlineArrowSmLeft
              onClick={() => setOpen(false)}
              className="hover:cursor-pointer"
              size={30}
            />{" "}
            <h2 className="font-medium">Change Password</h2>
          </span>
          <p className="text-[#333333] mt-1">
            Your password must be 6 characters long.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Old Password */}
            <div className="mt-4">
              <label className="block text-gray-600 mb-1">
                Enter old password
              </label>
              <Controller
                name="oldPassword"
                control={control}
                rules={{
                  required: "Old password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="Enter old password"
                    className="border border-green-500 h-[56px]"
                    prefix={<RiLock2Line color="#5C5C5C" />}
                  />
                )}
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="mt-4">
              <label className="block text-gray-600 mb-1">
                Set new password
              </label>
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="Set new password"
                    className="border border-green-500 h-[56px]"
                    prefix={<RiLock2Line color="#5C5C5C" />}
                  />
                )}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
              <label className="block text-gray-600 mb-1">
                Re-enter new password
              </label>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="Re-enter new password"
                    className="border border-green-500 h-[56px]"
                    prefix={<RiLock2Line color="#5C5C5C" />}
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* <span
              onClick={handleForgotPasswordToggle}
              className="text-green-600 text-sm mt-3 inline-block hover:cursor-pointer"
            >
              Forgot password?
            </span> */}

            <Button
              type="primary"
              className="w-full !bg-brand-primary !py-5 !mt-5 text-white font-semibold"
              htmlType="submit"
            >
              Update password
            </Button>
          </form>
        </div>
      ) : (
        <ForgotPassword
          setOpen={setOpen}
          setIsForgotPassword={setIsForgotPassword}
        />
      )}
    </Modal>
  );
};

export default ChangePasswordModal;
