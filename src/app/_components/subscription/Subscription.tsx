"use client";

import {
  useDeleteSubscriptionMutation,
  useGetAllSubscriptionQuery,
} from "@/redux/features/admin/subscription.api";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsExclamationTriangle, BsTrash2 } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import AddPlanModal from "./AddPlanModal";
import EditPlanModal from "./EditPlanModal";

import { ITier } from "../Tiers/tiers.interface";
import type { ISubscription } from "./subscription.interface";

const formatSubscription = (raw: any): ISubscription => ({
  _id: raw._id || raw.id, // Handle both _id and id
  appleProductId: raw.appleProductId,
  title: raw.title,
  description: raw.description,
  pricePerMonth: raw.pricePerMonth,
  discountPricePerMonth: raw.discountPricePerMonth,
  currency: raw.currency,
  features: Array.isArray(raw.features) ? raw.features : [],
  isAllTiers: raw.isAllTiers,
  tires: Array.isArray(raw.tires)
    ? raw.tires?.map((t: any) => ({
        _id: t._id || t.id, // Ensure _id is set
        id: t._id || t.id,
        name: t.name,
        monthlyPrice: t.monthlyPrice,
        promotionalPrice: t.promotionalPrice,
      }))
    : [],
});

// Delete Confirmation Modal Component
function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  planTitle,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planTitle: string;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-red-500 p-6 relative">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <IoClose className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <BsExclamationTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Confirm Delete</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-700 mb-2">
            Are you sure you want to delete the subscription plan:
          </p>
          <p className="text-lg font-bold text-slate-900 mb-4 bg-slate-100 px-4 py-2 rounded-lg">
            {planTitle}
          </p>
          <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <BsExclamationTriangle className="w-4 h-4 inline mr-2 text-amber-600" />
            This action cannot be undone. All associated data will be
            permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <BsTrash2 className="w-4 h-4" />
                Delete Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Subscription() {
  const { data, isLoading, isError } = useGetAllSubscriptionQuery({});
  const [deletePlan] = useDeleteSubscriptionMutation();
  const [plans, setPlans] = useState<ISubscription[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Delete confirmation states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data?.data) {
      console.log("Raw API data:", data.data); // Debug log
      const formatted = data.data.map(formatSubscription);
      console.log("Formatted plans:", formatted); // Debug log
      setPlans(formatted);
    }
  }, [data]);

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setIsEditOpen(true);
  };

  const handleAdd = (plan: ISubscription) => setPlans([...plans, plan]);

  const handleSave = (updatedPlan: ISubscription) => {
    if (editingIndex !== null) {
      const updatedPlans = [...plans];
      updatedPlans[editingIndex] = updatedPlan;
      setPlans(updatedPlans);
    }
  };

  // Delete handlers
  const handleDeleteClick = (planId: string | undefined, planTitle: string) => {
    if (!planId) return; // Guard clause
    setPlanToDelete({ id: planId, title: planTitle });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    setIsDeleting(true);
    try {
      await deletePlan(planToDelete.id).unwrap();
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      // You can add toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">
            Loading subscriptions...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold text-lg">
            Failed to load subscriptions
          </p>
          <p className="text-slate-500 mt-2">Please try again later</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-2">
              Subscription Plans
            </h1>
            <p className="text-slate-600 text-lg">
              Manage and configure your pricing tiers
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 !text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <PlusCircleOutlined
              size={20}
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
            />
            Add New Plan
          </button>
        </div>

        {/* Modals */}
        <AddPlanModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAdd}
        />
        <EditPlanModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          plan={editingIndex !== null ? plans[editingIndex] : null}
          onSave={handleSave}
        />
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          planTitle={planToDelete?.title || ""}
          isDeleting={isDeleting}
        />

        {/* Subscription Cards Grid */}
        {plans.length === 0 ? (
          <div className="text-center py-20">
            <HiSparkles className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">
              No plans yet
            </h3>
            <p className="text-slate-500">
              Create your first subscription plan to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const hasDiscount =
                plan?.discountPricePerMonth &&
                plan?.discountPricePerMonth < plan?.pricePerMonth;
              const discountPercent = hasDiscount
                ? Math.round(
                    ((plan?.pricePerMonth - plan?.discountPricePerMonth!) /
                      plan?.pricePerMonth) *
                      100
                  )
                : 0;

              return (
                <div
                  key={plan?._id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-emerald-300"
                >
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                      {discountPercent}% OFF
                    </div>
                  )}

                  {/* Gradient Header */}
                  <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>

                  <div className="p-6 md:p-8">
                    {/* Plan Title & Description */}
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                        {plan?.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed">
                        Apple Product ID: {plan?.appleProductId || "N/A"}
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        {plan?.description}
                      </p>
                    </div>

                    {/* Pricing Section */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-5xl font-extrabold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                          {plan?.discountPricePerMonth ?? plan?.pricePerMonth}
                        </span>
                        <span className="text-2xl font-semibold text-slate-600">
                          {plan?.currency}
                        </span>
                        <span className="text-slate-500 font-medium">
                          /month
                        </span>
                      </div>
                      {hasDiscount && (
                        <p className="text-slate-400 line-through text-lg font-medium">
                          {plan?.pricePerMonth} {plan?.currency}
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="mb-6">
                      <p className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">
                        What's Included
                      </p>
                      <ul className="space-y-3">
                        {plan?.features?.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 bg-gradient-to-br from-emerald-600 to-green-700 rounded-full shrink-0 p-2"></div>
                            <span className="text-slate-700 leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        )) ?? <li className="text-slate-400">No features</li>}
                      </ul>
                    </div>

                    {/* Applicable Tiers */}
                    <div className="mb-6 pt-6 border-t border-slate-100">
                      <p className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">
                        Applicable Tiers
                      </p>

                      {plan?.isAllTiers ? (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold border border-emerald-200">
                          <HiSparkles className="w-4 h-4" />
                          All Tiers
                        </span>
                      ) : plan?.tires?.length === 0 ? (
                        <span className="text-slate-400">
                          No tiers assigned
                        </span>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {plan?.tires?.map((tier: ITier) => (
                            <div
                              key={tier._id}
                              className="flex justify-between items-center bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200"
                            >
                              <span>{tier.name}</span>
                              <span>
                                {tier.promotionalPrice ?? tier.monthlyPrice}{" "}
                                {plan?.currency}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => openEditModal(index)}
                        disabled={!plan?._id}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 !text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <BiEdit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(plan?._id, plan?.title)
                        }
                        disabled={!plan?._id}
                        className="flex-1  bg-rose-50 hover:bg-rose-100 !text-rose-600 px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-rose-200 hover:border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <BsTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
