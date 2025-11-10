import { useUpdateTierMutation } from "@/redux/features/admin/tiers.api";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { ITier } from "./tiers.interface";

export default function EditTiersForm({
  defaultData,
  onClose,
}: {
  defaultData: ITier;
  onClose: () => void;
}) {
  const [updateTiers, { isLoading }] = useUpdateTierMutation();

  const [formData, setFormData] = useState<ITier>({
    _id: defaultData?._id || "",
    name: defaultData?.name || "",
    description: defaultData?.description || "",
    discountLabel: defaultData?.discountLabel || "",
    features: defaultData?.features || [],
    category: defaultData?.category || [],
    monthlyPrice: defaultData?.monthlyPrice || 0,
    promotionalPrice: defaultData?.promotionalPrice || 0,
    icon: defaultData?.icon || "",
    isVisible: defaultData?.isVisible ?? true,
  });

  const [tempFeature, setTempFeature] = useState("");
  const [tempCategory, setTempCategory] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "monthlyPrice" || name === "promotionalPrice"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, icon: file }));
  };

  const addFeature = () => {
    if (!tempFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, tempFeature.trim()],
    }));
    setTempFeature("");
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addCategory = () => {
    if (!tempCategory.trim()) return;
    setFormData((prev) => ({
      ...prev,
      category: [...prev.category, tempCategory.trim()],
    }));
    setTempCategory("");
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    const { icon, ...rest } = formData;
    form.append("data", JSON.stringify(rest));
    if (icon instanceof File) form.append("icon", icon);

    try {
      await updateTiers({ id: defaultData._id, data: form }).unwrap();
      onClose();
    } catch (err) {
      console.error("❌ Error updating tier:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tiers-form">
      <div className="rounded p-4 w-full max-w-md mx-auto">
        <h2 className="text-lg font-semibold flex items-center gap-2 justify-center mb-4">
          <FaPlus /> Edit Tier
        </h2>

        {/* Name & Price */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Tier Name"
            value={formData.name}
            onChange={handleChange}
            className="w-1/2 border !border-brand-primary rounded px-3 py-2 focus:outline-none"
          />
          <input
            type="number"
            name="monthlyPrice"
            placeholder="Monthly Price"
            value={formData.monthlyPrice}
            onChange={handleChange}
            className="w-1/2 border !border-brand-primary rounded px-3 py-2 focus:outline-none"
          />
        </div>

        {/* Promo & Discount */}
        <input
          type="number"
          name="promotionalPrice"
          placeholder="Promotional Price"
          value={formData.promotionalPrice}
          onChange={handleChange}
          className="w-full border !border-brand-primary rounded px-3 py-2 mb-2 focus:outline-none"
        />
        <input
          type="text"
          name="discountLabel"
          placeholder="Discount Label"
          value={formData.discountLabel}
          onChange={handleChange}
          className="w-full border !border-brand-primary rounded px-3 py-2 mb-2 focus:outline-none"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border !border-brand-primary rounded px-3 py-2 mb-2 resize-none h-20 focus:outline-none"
        />

        {/* Features */}
        <div className="mb-3">
          <label className="font-medium mb-1 block">Features</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempFeature}
              onChange={(e) => setTempFeature(e.target.value)}
              placeholder="Add a feature"
              className="w-full border !border-brand-primary rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-500 text-white px-3 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.features.map((f, i) => (
              <span
                key={i}
                className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
              >
                {f}
                <FaTimes
                  className="cursor-pointer"
                  onClick={() => removeFeature(i)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="font-medium mb-1 block">Category</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}
              placeholder="Add a category"
              className="w-full border !border-brand-primary rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={addCategory}
              className="bg-blue-500 text-white px-3 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.category.map((c, i) => (
              <span
                key={i}
                className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
              >
                {c}
                <FaTimes
                  className="cursor-pointer"
                  onClick={() => removeCategory(i)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Icon */}
        <label className="block mb-1 mt-2">Upload Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border !border-brand-primary rounded px-3 py-2 mb-2 cursor-pointer"
        />

        {/* Visibility */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Visibility</label>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVisible: e.target.checked,
                  }))
                }
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </label>
            <span className="text-sm text-gray-700">
              {formData.isVisible ? "Visible to users" : "Hidden from users"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-primary hover:bg-green-900 !text-white py-3 rounded"
        >
          {isLoading ? "Updating..." : "Update Tier"}
        </button>
      </div>
    </form>
  );
}
