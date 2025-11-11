"use client";

import { useCreateBadgeMutation } from "@/redux/features/admin/badge.api";
import { useGetAllTiersQuery } from "@/redux/features/admin/tiers.api";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Modal, Select, Upload } from "antd";
import { useState } from "react";
import { toast } from "sonner";

interface AddBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBadgeModal({ isOpen, onClose }: AddBadgeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    tiersId: "",
    numberOfContent: 0,
    icon: null as File | null,
  });

  const { data: tiersData } = useGetAllTiersQuery({});
  const [addBadge, { isLoading }] = useCreateBadgeMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    setFormData({ ...formData, icon: file });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAddBadge = async () => {
    if (
      !formData.name ||
      !formData.tiersId ||
      !formData.numberOfContent ||
      !formData.icon
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const data = new FormData();

      // Text data as a single object
      data.append(
        "data",
        JSON.stringify({
          name: formData.name,
          tiersId: formData.tiersId,
          numberOfContent: formData.numberOfContent,
        })
      );

      // Image file separately
      data.append("icon", formData.icon);

      const res = await addBadge(data).unwrap();
      if (res?.success) {
        toast.success("Badge added successfully!");
        setFormData({
          name: "",
          tiersId: "",
          numberOfContent: 0,
          icon: null,
        });
        setPreviewUrl(null);
        onClose();
      }
    } catch (err) {
      console.error("Error adding badge:", err);
    }
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Add New Badge</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4">
        {/* Badge Name */}
        <div>
          <label className="text-sm font-medium">Badge Name</label>
          <Input
            placeholder="Enter badge name (e.g. Gold Badge)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Tiers Dropdown */}
        <div>
          <label className="text-sm font-medium">Select Tier</label>
          <Select
            placeholder="Select a tier"
            className="w-full"
            value={formData.tiersId || undefined}
            onChange={(value) => setFormData({ ...formData, tiersId: value })}
            options={
              tiersData?.data?.map((tier: any) => ({
                label: tier.name,
                value: tier._id,
              })) || []
            }
          />
        </div>

        {/* Number of Content */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Number of Content</label>
          <InputNumber
            min={1}
            className="w-full"
            value={formData.numberOfContent}
            onChange={(value) =>
              setFormData({ ...formData, numberOfContent: value || 0 })
            }
          />
        </div>

        {/* Image Upload */}
        <div>
          <div className="flex  items-center gap-2">
            <label className="text-sm font-medium">Badge Icon</label>
            <Upload
              beforeUpload={(file) => {
                handleFileChange(file);
                return false; // prevent auto upload
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </div>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 w-16 h-16 rounded-full object-cover border"
            />
          )}
        </div>

        {/* Submit */}
        <Button
          type="primary"
          loading={isLoading}
          onClick={handleAddBadge}
          className="mt-4 w-full"
        >
          Add Badge
        </Button>
      </div>
    </Modal>
  );
}
