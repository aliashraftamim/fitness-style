"use client";

import { useGetAllTiersQuery } from "@/redux/features/admin/tiers.api";
import { useUpdateUserMutation } from "@/redux/features/admin/users.api";
import { Modal, Select } from "antd";
import React from "react";
import { toast } from "sonner";
import { ITier } from "../Tiers/tiers.interface";

type User = {
  _id: string;
  firstName: string;
};

type HandleUserSubscriptionProps = {
  visible: boolean;
  user: User | null;
  onCancel: () => void;
  loading?: boolean;
  actionUser: User | null;
  setActionUser: React.Dispatch<React.SetStateAction<User | null>>;
  setSubsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HandleUserSubscription = ({
  visible,
  user,
  onCancel,
  loading = false,
  actionUser,
  setActionUser,
  setSubsModalVisible,
}: HandleUserSubscriptionProps) => {
  const { data: tiers, isLoading: isTiersLoading } =
    useGetAllTiersQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const tiersData: ITier[] = tiers?.data || [];
  const [selectedTier, setSelectedTier] = React.useState<string>("");

  const handleTierChange = (value: string) => {
    setSelectedTier(value);
  };

  const handleSubmit = async () => {
    if (!user || !selectedTier) {
      toast.error("Please select a tier.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          "payment.tiersId": selectedTier,
          "payment.paymentMethod": "free",
          "payment.makeByAdmin": true,
        })
      );

      await updateUser({ id: user._id, data: formData }).unwrap();
      toast.success("User subscription updated successfully");

      setSubsModalVisible(false);
      setActionUser(null);
    } catch (err) {
      console.error("❌ Error updating tier:", err);
      toast.error("Failed to update user subscription");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Update"
      cancelText="Cancel"
      okButtonProps={{ loading: isUpdating || loading }}
      centered
      width={300}
      closable={false}
    >
      {user && (
        <div className="text-center">
          <Select
            showSearch
            placeholder="Select a tier"
            optionFilterProp="label"
            onChange={handleTierChange}
            value={selectedTier}
            loading={isTiersLoading}
            style={{ width: "100%" }}
            options={tiersData.map((tier) => ({
              value: tier._id,
              label: tier.name,
            }))}
          />
        </div>
      )}
    </Modal>
  );
};
