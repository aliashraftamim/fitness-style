"use client";

import { useGetAllSubscriptionQuery } from "@/redux/features/admin/subscription.api";
import { useEffect, useState } from "react";
import AddPlanModal from "./AddPlanModal";
import EditPlanModal from "./EditPlanModal";
import { ISubscription } from "./subscription.interface";

const formatSubscription = (raw: any): ISubscription => ({
  _id: raw._id.$oid,
  title: raw.title,
  tires: raw.tires.map((t: any) => t.$oid),
  description: raw.description,
  pricePerMonth: raw.pricePerMonth,
  discountPricePerMonth: raw.discountPricePerMonth,
  currency: raw.currency,
  features: raw.features,
  isAllTiers: raw.isAllTiers,
});

export default function Subscription() {
  const { data, isLoading, isError } = useGetAllSubscriptionQuery({});
  const [plans, setPlans] = useState<ISubscription[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data?.data) {
      const formatted = data.data.map(formatSubscription);
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

  if (isLoading) return <p>Loading subscriptions...</p>;
  if (isError) return <p>Failed to load subscriptions</p>;

  return (
    <div className="min-h-screen bg-[#E6ECE8] p-6 md:p-12">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-green-900 !text-white px-4 py-2 rounded-md font-medium shadow"
        >
          + Add New Plan
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div key={plan._id} className="rounded-xl p-6 shadow bg-white">
            <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>

            <p className="text-2xl font-bold text-purple-600 mb-1">
              {plan.discountPricePerMonth ?? plan.pricePerMonth} {plan.currency}
              /month
            </p>
            {plan.discountPricePerMonth && (
              <p className="text-sm text-gray-400 line-through">
                {plan.pricePerMonth} {plan.currency}
              </p>
            )}

            <ul className="text-sm space-y-2 mb-4">
              {plan?.features?.map((feature, idx) => (
                <li key={idx}>✔ {feature}</li>
              ))}
            </ul>

            <div className="flex gap-4">
              <button
                onClick={() => openEditModal(index)}
                className="bg-green-900 !text-white px-4 py-2 rounded-md w-full"
              >
                Edit
              </button>
              <button className="bg-red-200 text-red-600 px-4 py-2 rounded-md w-full">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
