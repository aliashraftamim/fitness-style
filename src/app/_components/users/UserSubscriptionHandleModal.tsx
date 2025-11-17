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
      okText="Update Subscription"
      cancelText="Cancel"
      okButtonProps={{
        loading: isUpdating || loading,
        className: "bg-blue-600 hover:bg-blue-700",
      }}
      centered
      width={480}
      closable={true}
      destroyOnClose
      styles={{
        mask: { backdropFilter: "blur(4px)" },
      }}
    >
      {user && (
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Update Subscription Plan
            </h3>
            <p className="text-sm text-gray-600">
              Assign a subscription tier for{" "}
              <span className="font-medium text-gray-900">
                {user.firstName}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Tier
            </label>
            <Select
              showSearch
              placeholder="Choose a subscription tier"
              optionFilterProp="label"
              onChange={handleTierChange}
              value={selectedTier || undefined}
              loading={isTiersLoading}
              size="large"
              className="w-full"
              options={tiersData.map((tier) => ({
                value: tier._id,
                label: tier.name,
              }))}
            />
            {selectedTier && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                This will be assigned as a free subscription by admin
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
