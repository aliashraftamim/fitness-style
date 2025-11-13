"use client";

import { useChangeMyPasswordMutation } from "@/redux/features/auth/authApi";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button, Input, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface ChangePasswordModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  setOpen,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const currentUser = useAppSelector(selectCurrentUser);

  const [changePassword, { isLoading }] = useChangeMyPasswordMutation();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

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

    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
        confirmPassword: confirmPassword,
      }).unwrap();

      if (res.success) {
        toast.success("Password changed successfully!");
        dispatch(logout());
        router.push("/login");
      } else {
        toast.error(res.message || "Failed to change password");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
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
      {!isForgotPassword ? (
        <div className="w-[484px] px-6 pb-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <HiOutlineArrowSmLeft
              onClick={() => setOpen(false)}
              className="hover:cursor-pointer"
              size={30}
            />
            <h2 className="font-medium text-lg">Change Password</h2>
          </div>
          <p className="text-[#333333] text-sm mb-4">
            Your password must be at least 6 characters long.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Old Password */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Old Password</label>
              <Controller
                name="oldPassword"
                control={control}
                rules={{
                  required: "Old password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
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
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">New Password</label>
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: "New password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
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
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">
                Confirm New Password
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

            <Button
              type="primary"
              loading={isLoading}
              className="w-full !bg-brand-primary !py-5 !mt-5 text-white font-semibold"
              htmlType="submit"
            >
              Update Password
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
