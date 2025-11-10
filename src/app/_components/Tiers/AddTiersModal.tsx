import { useAddTierMutation } from "@/redux/features/admin/tiers.api";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { IoTimeSharp } from "react-icons/io5";
import { toast } from "sonner";

export default function AddTiersForm({ onClose }: { onClose: () => void }) {
  const [addTier, { isLoading }] = useAddTierMutation();

  const [formData, setFormData] = useState({
    name: "",
    monthlyPrice: "",
    promotionalPrice: "",
    icon: null as File | string | null,
    discountLabel: "",
    description: "",
    features: [] as string[],
    category: [] as string[],
  });

  const [tempFeature, setTempFeature] = useState("");
  const [tempCategory, setTempCategory] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) setFormData((prev) => ({ ...prev, icon: file }));
  };

  const addFeature = () => {
    if (tempFeature.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, tempFeature.trim()],
    }));
    setTempFeature("");
  };

  const addCategory = () => {
    if (tempCategory.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      category: [...prev.category, tempCategory.trim()],
    }));
    setTempCategory("");
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { icon, ...data } = formData;
    const form = new FormData();
    form.append("data", JSON.stringify(data));
    if (icon instanceof File) form.append("icon", icon);
    else if (typeof icon === "string") form.append("icon", icon);

    try {
      await addTier(form).unwrap();
      toast.success("Tier added successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add tier!");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tiers-form">
      <div className="rounded p-4 w-full max-w-md mx-auto">
        <h2 className="text-lg font-semibold flex items-center gap-2 justify-center mb-4">
          <PlusCircleTwoTone className="text-brand-primary" /> Add New Tier
        </h2>

        {/* Basic Info */}
        <input
          type="text"
          name="name"
          placeholder="Tier Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-brand-primary rounded px-3 py-2 !mb-2"
        />
        <input
          type="text"
          name="monthlyPrice"
          placeholder="Monthly Price"
          value={formData.monthlyPrice}
          onChange={handleChange}
          className="w-full border border-brand-primary rounded px-3 py-2 !mb-2"
        />
        <input
          type="text"
          name="promotionalPrice"
          placeholder="Promotional Price"
          value={formData.promotionalPrice}
          onChange={handleChange}
          className="w-full border border-brand-primary rounded px-3 py-2 !mb-2"
        />
        <input
          type="text"
          name="discountLabel"
          placeholder="Discount Label"
          value={formData.discountLabel}
          onChange={handleChange}
          className="w-full border border-brand-primary rounded px-3 py-2 !mb-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-brand-primary rounded px-3 py-2 mb-2 resize-none h-20"
        />

        {/* Features Input */}
        <div className="mb-3">
          <label className="font-medium mb-1 block">Features</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempFeature}
              onChange={(e) => setTempFeature(e.target.value)}
              className="w-full border border-brand-primary rounded px-3 py-2"
              placeholder="Add a feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-500 !text-white px-3 rounded"
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
                <IoTimeSharp
                  className="cursor-pointer"
                  onClick={() => removeFeature(i)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Category Input */}
        <div className="mb-3">
          <label className="font-medium mb-1 block">Category</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}
              className="w-full border border-brand-primary rounded px-3 py-2"
              placeholder="Add a category"
            />
            <button
              type="button"
              onClick={addCategory}
              className="bg-blue-500 !text-white px-3 rounded"
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
                <IoTimeSharp
                  className="cursor-pointer"
                  onClick={() => removeCategory(i)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Icon Upload */}
        <label className="block mb-1 mt-2">Upload Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border border-brand-primary rounded px-3 py-2 !mb-2 cursor-pointer"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-primary hover:bg-green-900 !text-white py-3 rounded"
        >
          {isLoading ? "Adding..." : "Add Tier"}
        </button>
      </div>
    </form>
  );
}
