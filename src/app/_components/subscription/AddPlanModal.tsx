"use client";

import { useCreateSubscriptionMutation } from "@/redux/features/admin/subscription.api";
import { useGetAllTiersQuery } from "@/redux/features/admin/tiers.api";
import React, { useState } from "react";
import { FaCheck, FaLayerGroup, FaPlus } from "react-icons/fa6";
import { toast } from "sonner";
import DynamicModal from "../shared/DynamicModal";
import { ISubscription } from "./subscription.interface";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: ISubscription) => void;
}

const AddPlanModal: React.FC<AddPlanModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [addPlan] = useCreateSubscriptionMutation();
  const { data: tiersData, isLoading: isLoadingTiers } = useGetAllTiersQuery(
    {}
  );
  const tiers = tiersData?.data || [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"USD" | "INR" | "EUR">("USD");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [isAllTiers, setIsAllTiers] = useState(false);

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSelectTier = (tierId: string) => {
    if (selectedTiers.includes(tierId)) {
      setSelectedTiers(selectedTiers.filter((id) => id !== tierId));
    } else {
      setSelectedTiers([...selectedTiers, tierId]);
    }
  };

  const handleSelectAllTiers = () => {
    setSelectedTiers(tiers.map((t: any) => t._id));
    setIsAllTiers(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPlan: Omit<ISubscription, "_id"> = {
      title,
      description,
      pricePerMonth: price,
      discountPricePerMonth: discount,
      currency,
      features,
      tires: selectedTiers,
      isAllTiers,
    };

    try {
      const result = await addPlan(newPlan).unwrap();
      onAdd(result);
      onClose();

      // Reset fields
      setTitle("");
      setDescription("");
      setPrice(0);
      setDiscount(null);
      setFeatures([]);
      setSelectedTiers([]);
      setIsAllTiers(false);
    } catch (err: any) {
      console.error("Failed to add plan:", err?.data?.message || err.message);
      toast.error("Failed to add plan: " + (err?.data?.message || err.message));
    }
  };

  return (
    <DynamicModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
            Add New Plan
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the details below
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Plan Title *
                </label>
                <input
                  type="text"
                  placeholder="Premium Plan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(e.target.value as "USD" | "INR" | "EUR")
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Description *
              </label>
              <textarea
                placeholder="Brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Price/Month *
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Discount Price
                </label>
                <input
                  type="number"
                  placeholder="Optional"
                  value={discount ?? ""}
                  onChange={(e) =>
                    setDiscount(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Features Section - Compact */}
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <label className="block text-xs font-semibold text-gray-800 mb-2">
                Features
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add feature..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddFeature())
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FaPlus className="w-3 h-3" />
                  Add
                </button>
              </div>

              {/* Features List - Scrollable */}
              {features.length > 0 ? (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {features.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <FaCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-gray-800 line-clamp-1">
                          {f}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-red-600 hover:text-red-700 font-bold text-lg leading-none ml-2 flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-2 italic">
                  No features added
                </p>
              )}
            </div>

            {/* Tiers Selection - Compact */}
            <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaLayerGroup className="text-emerald-600 w-3.5 h-3.5" />
                  <h3 className="text-xs font-semibold text-gray-800">
                    Select Tiers
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllTiers}
                  className="text-xs text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  Select All
                </button>
              </div>

              {/* All Tiers Checkbox */}
              <div className="flex items-center gap-2 mb-3 bg-white px-3 py-2 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="isAllTiers"
                  checked={isAllTiers}
                  onChange={(e) => setIsAllTiers(e.target.checked)}
                  className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                />
                <label
                  htmlFor="isAllTiers"
                  className="text-sm text-gray-700 font-medium cursor-pointer"
                >
                  Apply to all tiers
                </label>
              </div>

              {/* Tier Grid - Scrollable */}
              {!isAllTiers ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {tiers && tiers.length > 0 ? (
                    tiers.map((tier: any) => {
                      const selected = selectedTiers.includes(tier._id);
                      return (
                        <div
                          key={tier._id}
                          onClick={() => handleSelectTier(tier._id)}
                          className={`relative border p-2 rounded-lg cursor-pointer transition-all ${
                            selected
                              ? "border-emerald-600 bg-emerald-50"
                              : "border-gray-300 bg-white hover:border-emerald-400"
                          }`}
                        >
                          <div
                            className={`absolute top-1.5 right-1.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              selected
                                ? "bg-emerald-600 border-emerald-600"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            <FaCheck
                              className={`w-2.5 h-2.5 ${
                                selected ? "text-white" : "text-transparent"
                              }`}
                            />
                          </div>

                          <p
                            className={`text-xs font-semibold pr-5 truncate ${
                              selected ? "text-emerald-700" : "text-gray-800"
                            }`}
                          >
                            {tier.name}
                          </p>
                          {tier.monthlyPrice && (
                            <p className="text-xs text-gray-600 mt-0.5">
                              ${tier.monthlyPrice}/mo
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-500 col-span-full text-center py-3">
                      {isLoadingTiers ? "Loading..." : "No tiers available"}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-600">
                    ✓ All available tiers included
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
          >
            Add Plan
          </button>
        </div>
      </div>
    </DynamicModal>
  );
};

export default AddPlanModal;
