"use client";

import { useCreateSubscriptionMutation } from "@/redux/features/admin/subscription.api";
import { useGetAllTiersQuery } from "@/redux/features/admin/tiers.api";
import React, { useState } from "react";
import DynamicModal from "../shared/DynamicModal";
import { ISubscription } from "./subscription.interface";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: ISubscription) => void;
}

export default function AddPlanModal({
  isOpen,
  onClose,
  onAdd,
}: AddPlanModalProps) {
  const [addPlan] = useCreateSubscriptionMutation();
  const { data: tiers, isLoading: isLoadingTiers } = useGetAllTiersQuery({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"USD" | "INR" | "EUR">("USD");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // UI-এর জন্য selected tiers names
  const [selectedTiersNames, setSelectedTiersNames] = useState<string[]>([]);
  // API-এর জন্য selected tiers ids
  const [selectedTiersIds, setSelectedTiersIds] = useState<string[]>([]);

  const allTiers = tiers?.data || [];

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleTierChange = (tier: any, checked: boolean) => {
    if (checked) {
      setSelectedTiersIds([...selectedTiersIds, tier._id]);
      setSelectedTiersNames([...selectedTiersNames, tier.name]);
    } else {
      setSelectedTiersIds(selectedTiersIds.filter((id) => id !== tier._id));
      setSelectedTiersNames(
        selectedTiersNames.filter((name) => name !== tier.name)
      );
    }
  };

  const handleAddAllTiers = () => {
    setSelectedTiersIds(allTiers.map((t: { _id: any }) => t._id));
    setSelectedTiersNames(allTiers.map((t: { name: any }) => t.name));
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
      tires: selectedTiersIds, // API তে only _id পাঠানো হচ্ছে
      isAllTiers: false,
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
      setSelectedTiersIds([]);
      setSelectedTiersNames([]);
    } catch (err: any) {
      console.error("Failed to add plan:", err?.data?.message || err.message);
      alert("Failed to add plan: " + (err?.data?.message || err.message));
    }
  };

  return (
    <DynamicModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        {/* Modal Title & Subtitle */}
        <h2 className="text-xl font-bold mb-1">Add New Subscription Plan</h2>
        <p className="text-sm text-gray-500 mb-4">
          Fill in the details below and select the tiers this plan applies to.
        </p>

        <form onSubmit={handleSubmit} className="!space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Price Per Month"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Discount Price (optional)"
            value={discount ?? ""}
            onChange={(e) =>
              setDiscount(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2 border rounded-md"
          />
          <select
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value as "USD" | "INR" | "EUR")
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
          </select>

          {/* Features Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add Feature"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((f, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-red-500 font-bold"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tiers Selection */}
          <div className="space-y-2">
            <label className="font-semibold">Select Tiers</label>
            <div className="flex flex-col max-h-40 overflow-y-auto border p-2 rounded-md gap-1">
              {allTiers.map((tier: any) => (
                <label key={tier._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTiersIds.includes(tier._id)}
                    onChange={(e) => handleTierChange(tier, e.target.checked)}
                  />
                  {tier.name}
                </label>
              ))}
            </div>
            <button
              type="button"
              className="px-3 py-1 bg-blue-600 text-white rounded-md mt-1"
              onClick={handleAddAllTiers}
            >
              Add All
            </button>
          </div>

          {/* Show Selected Tiers Names */}
          {selectedTiersNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTiersNames.map((name, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1"
                >
                  {name}
                </span>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-900 text-white rounded-md mt-4"
          >
            Add Plan
          </button>
        </form>
      </div>
    </DynamicModal>
  );
}
