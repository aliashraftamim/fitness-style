"use client";

import { useUpdateAndDeleteMutation } from "@/redux/features/admin/subscription.api";
import { useGetAllTiersQuery } from "@/redux/features/admin/tiers.api";
import React, { useEffect, useState } from "react";
import DynamicModal from "../shared/DynamicModal";
import { ISubscription } from "./subscription.interface";

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ISubscription | null;
  onSave: (plan: ISubscription) => void;
}

export default function EditPlanModal({
  isOpen,
  onClose,
  plan,
  onSave,
}: EditPlanModalProps) {
  console.log("🚀 ~ EditPlanModal ~ plan:", plan);
  const [update] = useUpdateAndDeleteMutation();
  const { data: tiers } = useGetAllTiersQuery({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"USD" | "INR" | "EUR">("USD");

  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const [selectedTiersNames, setSelectedTiersNames] = useState<string[]>([]);
  const [selectedTiersIds, setSelectedTiersIds] = useState<string[]>([]);

  const allTiers = tiers?.data || [];

  useEffect(() => {
    if (plan) {
      setTitle(plan.title);
      setDescription(plan.description);
      setPrice(plan.pricePerMonth);
      setDiscount(plan.discountPricePerMonth ?? null);
      setCurrency(plan.currency);
      setFeatures(plan.features || []);
      setSelectedTiersIds(plan.tires || []);
      // Map ids to names for UI
      const tierNames = allTiers
        .filter((t: { _id: string }) => plan.tires?.includes(t._id))
        .map((t: { name: any }) => t.name);
      setSelectedTiersNames(tierNames);
    }
  }, [plan, allTiers]);

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
    if (!plan) return;

    const updatedPlan: Omit<ISubscription, "_id"> = {
      title,
      description,
      pricePerMonth: price,
      discountPricePerMonth: discount,
      currency,
      features,
      tires: selectedTiersIds,
      isAllTiers: false,
    };

    try {
      const result = await update({ id: plan._id, data: updatedPlan }).unwrap();
      onSave(result);
      onClose();
    } catch (err: any) {
      console.error(
        "Failed to update plan:",
        err?.data?.message || err.message
      );
      alert("Failed to update plan: " + (err?.data?.message || err.message));
    }
  };

  return (
    <DynamicModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-1">Edit Subscription Plan</h2>
        <p className="text-sm text-gray-500 mb-4">
          Update plan details and select the tiers it applies to.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Features */}
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

          {/* Tiers */}
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

          {/* Selected Tier Names */}
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
            Save Changes
          </button>
        </form>
      </div>
    </DynamicModal>
  );
}
