"use client";

import {
  useDeleteTierMutation,
  useGetAllTiersQuery,
} from "@/redux/features/admin/tiers.api";
import { EyeFilled, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Modal, Skeleton, Tag, Tooltip } from "antd";
import Image from "next/image";
import { useState } from "react";
import { FaCheckCircle, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import DynamicModal from "../shared/DynamicModal";
import AddTiersForm from "./AddTiersModal";
import EditTiersForm from "./EditTiersModal";
import "./tiers.css";
import { ITier } from "./tiers.interface";

export default function Tiers() {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<ITier | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    tierId: string | null;
  }>({ visible: false, tierId: null });

  const { data: tiers, isLoading, isError } = useGetAllTiersQuery(undefined);
  const tiersData: ITier[] = tiers?.data || [];
  const [deleteTier] = useDeleteTierMutation();

  const handleAddNew = () => {
    setEditData(null);
    setIsOpen(true);
  };

  const handleEdit = (tier: ITier) => {
    setEditData(tier);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditData(null);
  };

  const openDeleteConfirm = (id: string) => {
    setConfirmModal({ visible: true, tierId: id });
  };

  const handleDelete = async () => {
    if (!confirmModal.tierId) return;
    try {
      await deleteTier(confirmModal.tierId).unwrap();
      setConfirmModal({ visible: false, tierId: null });
    } catch (error) {
      console.error("Failed to delete tier:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <Empty
            description={
              <span className="text-gray-600">
                Failed to load tiers. Please try again.
              </span>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Subscription Tiers
              </h1>
              <p className="text-gray-600">
                Manage your subscription plans and pricing
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<FaPlus />}
              onClick={handleAddNew}
              className="!bg-[#0B3F28] hover:!bg-[#0d5234] border-none shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Add New Tier
            </Button>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {tiersData.map((tier: ITier, index: number) => (
            <Card
              key={tier._id}
              className="border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              bodyStyle={{ padding: "20px" }}
              style={{
                background: `linear-gradient(135deg, ${
                  index % 4 === 0
                    ? "#0B3F28"
                    : index % 4 === 1
                    ? "#166534"
                    : index % 4 === 2
                    ? "#15803d"
                    : "#16a34a"
                } 0%, ${
                  index % 4 === 0
                    ? "#064e3b"
                    : index % 4 === 1
                    ? "#14532d"
                    : index % 4 === 2
                    ? "#166534"
                    : "#15803d"
                } 100%)`,
              }}
            >
              <div className="flex flex-col items-center justify-center gap-2 text-white">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  {tier?.icon && (
                    <Image
                      src={tier?.icon}
                      alt={tier?.name}
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  {tier?.name}
                </h2>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed Tier Cards */}
        {tiersData.length === 0 ? (
          <Card className="shadow-md">
            <Empty
              description={
                <span className="text-gray-600">
                  No tiers available. Create your first tier to get started.
                </span>
              }
            >
              <Button
                type="primary"
                icon={<FaPlus />}
                onClick={handleAddNew}
                className="bg-[#0B3F28] hover:bg-[#0d5234] border-none"
              >
                Create First Tier
              </Button>
            </Empty>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tiersData.map((tier: ITier) => {
              const hasDiscount = tier.promotionalPrice < tier.monthlyPrice;
              const discountPercent = hasDiscount
                ? Math.round(
                    ((tier.monthlyPrice - tier.promotionalPrice) /
                      tier.monthlyPrice) *
                      100
                  )
                : 0;

              return (
                <Card
                  key={tier._id}
                  className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  bodyStyle={{ padding: 0 }}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[#0B3F28] to-[#166534] text-white p-6 relative">
                    {hasDiscount && (
                      <div className="absolute top-4 right-4">
                        <Tag
                          icon={<HiSparkles />}
                          color="gold"
                          className="font-semibold"
                        >
                          {discountPercent}% OFF
                        </Tag>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        {tier?.icon && (
                          <Image
                            src={tier?.icon}
                            alt={tier?.name}
                            width={60}
                            height={60}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          {hasDiscount && (
                            <span className="text-lg line-through opacity-70">
                              ${tier.monthlyPrice}
                            </span>
                          )}
                          <span className="text-3xl font-bold">
                            ${tier.promotionalPrice}
                          </span>
                          <span className="text-sm opacity-90">/month</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                      {tier.description}
                    </p>

                    {/* Features List */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                        Features Included
                      </h4>
                      <ul className="space-y-2">
                        {tier.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Categories */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                        Categories ({tier.category.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tier.category.map((cat, i) => (
                          <Tag key={i} color="green">
                            {cat}
                          </Tag>
                        ))}
                        {/* {tier.category.length > 3 && ( */}
                        {/* <Tag color="default">+{tier.category.length - 3}</Tag> */}
                        {/* )} */}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <Tag
                        icon={!tier.isVisible ? <EyeFilled /> : <EyeOutlined />}
                        color="volcano"
                      >
                        {tier.isVisible ? "Visible" : "Hidden"}
                      </Tag>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Tooltip title="Edit tier details">
                        <Button
                          type="default"
                          icon={<FaEdit />}
                          onClick={() => handleEdit(tier)}
                          className="flex-1 hover:border-[#0B3F28] hover:text-[#0B3F28] transition-colors"
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete this tier">
                        <Button
                          danger
                          icon={<FaTrash />}
                          className="flex-1"
                          onClick={() => openDeleteConfirm(tier._id)}
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Unified Modal for Add/Edit */}
      <DynamicModal isOpen={isOpen} onClose={handleClose}>
        {editData ? (
          <EditTiersForm defaultData={editData} onClose={handleClose} />
        ) : (
          <AddTiersForm onClose={handleClose} />
        )}
      </DynamicModal>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={confirmModal.visible}
        onOk={handleDelete}
        onCancel={() => setConfirmModal({ visible: false, tierId: null })}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete this tier? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
