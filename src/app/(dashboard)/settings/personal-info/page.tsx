"use client";

import {
  useGetMeQuery,
  useUpdateMeMutation,
} from "@/redux/features/admin/admin.api";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { toast } from "sonner";

const PersonalInfoPage = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://res.cloudinary.com/demo/image/upload/v1698900000/default-profile.jpg"
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const { data: getMe, refetch } = useGetMeQuery(undefined);
  console.log("🚀 ~ PersonalInfoPage ~ getMe:", getMe);
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (getMe?.data) {
      reset({
        name: getMe.data.firstName,
        email: getMe.data.email,
        phoneNumber: getMe.data.contactNumber,
      });
      setProfileImage(
        getMe.data.profileImage ||
          "https://res.cloudinary.com/demo/image/upload/v1698900000/default-profile.jpg"
      );
    }
  }, [getMe, reset]);

  if (!hasMounted) return null;

  const handleToggleEdit = () => setIsDisabled(false);

  // Image upload handle + auto save
  const handleUploadImage = async (info: any) => {
    console.log("🚀 ~ handleUploadImage ~ info:", info.file);
    if (info.file) {
      const file = info.file.originFileObj;
      console.log("🚀 ~ handleUploadImage ~ file:", file);

      setProfileImage(URL.createObjectURL(file));
      setProfileImageFile(file);

      try {
        const formData = new FormData();
        formData.append("profileImage", file);

        // API call
        const response = await updateMe(formData).unwrap();
        console.log("🚀 ~ handleUploadImage ~ response:", response);

        // backend থেকে আসা image URL state এ set করবে
        if (response.data?.profileImage) {
          setProfileImage(response.data.profileImage);
        }

        toast.success("Profile image updated successfully!");
        refetch();
      } catch (err) {
        toast.error("Failed to update profile image.");
        console.error(err);
      }
    } else if (info.file.status === "error") {
      toast.error(`${info.file.name} upload failed.`);
    }
  };

  // Form submit for name/phone only
  const onSubmit = async (values: any) => {
    try {
      const payload = {
        firstName: values.name,
        contactNumber: values.phoneNumber,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      const response = await updateMe(formData).unwrap();
      console.log("🚀 ~ onSubmit ~ response:", response);
      toast.success("Info updated successfully!");
      refetch();
      setIsDisabled(true);
    } catch (err) {
      toast.error("Failed to update info.");
      console.error(err);
    }
  };

  return (
    <Form
      className="w-[1026px] !pt-5"
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between mb-[40px]">
        <span className="flex items-center gap-3 text-[#333333]">
          <Link href="/settings">
            <HiOutlineArrowSmLeft color="#333333" size={30} />
          </Link>
          <h2 className="font-medium">Personal Information</h2>
        </span>

        {isDisabled ? (
          <button
            className="!bg-brand-primary !text-white  !w-[206px] !h-[40px] !rounded-xl"
            onClick={handleToggleEdit}
          >
            Edit Form
          </button>
        ) : (
          <Button
            className="!bg-brand-primary w-[206px] h-[56px]"
            size="large"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Save Changes
          </Button>
        )}
      </div>

      <div className="flex items-center justify-start gap-10">
        {/* Profile Image Section */}
        <div className="min-w-[300px] h-[365px] bg-[#C4E5CD] border border-[#41AB5D] rounded-lg flex flex-col items-center justify-center">
          <Image
            src={profileImage}
            width={144}
            height={144}
            alt="admin-image"
            className="rounded-full object-cover size-28 mb-3"
          />
          <Upload
            onChange={handleUploadImage}
            showUploadList={false}
            disabled={isDisabled} // Only enable in edit mode
          >
            <Button icon={<UploadOutlined />} disabled={isDisabled}>
              Click to Upload
            </Button>
          </Upload>
          <h3 className="text-[18px] mt-[30px]">Profile</h3>
          <h2 className="capitalize">admin</h2>
        </div>

        {/* Form Fields */}
        <div className="mt-[12px] min-w-[700px]">
          <Form.Item label="Name">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={isDisabled}
                  style={{
                    backgroundColor: "#C4E5CD",
                    borderColor: "#41AB5D",
                    height: "56px",
                    color: "#000",
                    cursor: isDisabled ? "not-allowed" : "auto",
                  }}
                  placeholder="Enter your name"
                />
              )}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled
                  className="cursor-not-allowed"
                  style={{
                    backgroundColor: "#C4E5CD",
                    borderColor: "#41AB5D",
                    height: "56px",
                    color: "#000",
                    cursor: "not-allowed",
                  }}
                  placeholder="Enter your email"
                />
              )}
            />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={isDisabled}
                  style={{
                    backgroundColor: "#C4E5CD",
                    borderColor: "#41AB5D",
                    height: "56px",
                    color: "#000",
                    cursor: isDisabled ? "not-allowed" : "auto",
                  }}
                  placeholder="Enter your phone number"
                />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default PersonalInfoPage;
