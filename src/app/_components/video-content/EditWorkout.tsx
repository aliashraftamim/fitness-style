"use client";

import { useGetAllTiersQuery } from "@/redux/features/admin/tiers.api";
import { useUpdateVideoContentMutation } from "@/redux/features/admin/video-content.api";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DynamicModal from "../shared/DynamicModal";
import { ITier } from "../Tiers/tiers.interface";

export interface IWorkoutPlan {
  _id?: string;
  workoutTitle: string;
  subtitle: string;
  description: string;
  image?: string;
  videoUrl?: string;
  workoutType: string;
  workoutPlan: string[];
  tier: string | ITier;
}

interface EditWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: any) => void;
  editData?: IWorkoutPlan | null;
}

const EditWorkoutModal: React.FC<EditWorkoutModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editData,
}) => {
  const [updatePlan, { isLoading: isUpdating }] =
    useUpdateVideoContentMutation();
  const { data: tiersData } = useGetAllTiersQuery({});
  const tiers = tiersData?.data || [];

  // 🧠 Normal states
  const [planData, setPlanData] = useState<IWorkoutPlan>({
    workoutTitle: "",
    subtitle: "",
    description: "",
    workoutType: "Beginner",
    workoutPlan: [],
    tier: "",
  });

  const [planInput, setPlanInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  // Load edit data when modal opens
  useEffect(() => {
    if (editData && isOpen) {
      setPlanData(editData);
      // If there's existing image/video URL, show preview
      if (editData.image) {
        setImagePreview(editData.image);
      }
      if (editData.videoUrl) {
        setVideoPreview(editData.videoUrl);
      }
    }
  }, [editData, isOpen]);

  // 🔄 Handle text/select/textarea inputs
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "tier") {
      setPlanData((prev) => ({ ...prev, tier: value, workoutType: "" }));
    } else {
      setPlanData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🖼️ Image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  // 🎥 Video upload
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // ➕ Add workout step
  const handleAddPlanItem = () => {
    if (planInput.trim()) {
      setPlanData((prev) => ({
        ...prev,
        workoutPlan: [...prev.workoutPlan, planInput.trim()],
      }));
      setPlanInput("");
    }
  };

  // ❌ Remove workout step
  const handleRemovePlanItem = (index: number) => {
    setPlanData((prev) => ({
      ...prev,
      workoutPlan: prev.workoutPlan.filter((_, i) => i !== index),
    }));
  };

  // 🚀 Submit with FormData
  const handleSubmit = async () => {
    if (!planData.workoutTitle || !planData.description || !planData.tier) {
      return toast.error("Please fill all required fields!");
    }

    if (!planData._id) {
      return toast.error("Video content ID is missing!");
    }

    try {
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          workoutTitle: planData.workoutTitle,
          subtitle: planData.subtitle,
          description: planData.description,
          workoutType: planData.workoutType,
          workoutPlan: planData.workoutPlan,
          tier:
            typeof planData.tier === "string"
              ? planData.tier
              : (planData.tier as ITier)?._id || planData.tier,
        })
      );

      // Append files only if new files are selected
      if (imageFile) formData.append("image", imageFile);
      if (videoFile) formData.append("video", videoFile);

      // API Call with id and formData
      const result = await updatePlan({
        id: planData._id,
        data: formData,
      }).unwrap();

      onAdd(result);
      onClose();
      toast.success("Workout updated successfully!");

      // Reset all
      setImageFile(null);
      setVideoFile(null);
      setImagePreview("");
      setVideoPreview("");
      setPlanData({
        workoutTitle: "",
        subtitle: "",
        description: "",
        workoutType: "Beginner",
        workoutPlan: [],
        tier: "",
      });
      setPlanInput("");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.data?.message || err.message || "Failed to update workout."
      );
    }
  };

  return (
    <DynamicModal isOpen={isOpen} onClose={onClose}>
      <div className="!max-h-[90vh] overflow-y-scroll space-y-5">
        {/* 🖼️ Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Workout Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center relative hover:border-green-400 transition-colors bg-gray-50">
            <div className="text-4xl text-gray-400 mb-3">📁</div>
            <p className="text-gray-600 text-sm">
              Drop your image here or{" "}
              <span className="text-green-600 font-semibold">browse</span>
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 h-48 w-full object-cover rounded-lg"
            />
          )}
        </div>

        {/* 🎥 Video Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Workout Video
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center relative hover:border-green-400 transition-colors bg-gray-50">
            <div className="text-3xl text-gray-400 mb-2">🎥</div>
            <p className="text-gray-600 text-sm">
              Upload video file or{" "}
              <span className="text-green-600 font-semibold">browse</span>
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          {videoPreview && (
            <p className="text-sm text-green-600 mt-2">✓ Video uploaded</p>
          )}
        </div>

        {/* 🧩 Other Inputs */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Workout Title
          </label>
          <input
            type="text"
            name="workoutTitle"
            value={planData.workoutTitle}
            onChange={handleInputChange}
            placeholder="e.g. Full Body Functional Training"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={planData.subtitle}
            onChange={handleInputChange}
            placeholder="e.g. Intermediate Level"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 🎚️ Tier */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tier Level
          </label>
          <select
            name="tier"
            value={typeof planData.tier === "string" ? planData.tier : (planData.tier as ITier)?._id || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">Select Tier</option>
            {tiers.map((t: any) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🏋️ Workout Type (depends on tier) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Workout Type
          </label>
          <select
            name="workoutType"
            value={planData.workoutType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">Select Workout Type</option>
            {tiers
              .find((t: any) => t._id === planData.tier)
              ?.category?.map((c: any) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>

        {/* 📝 Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={planData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* 📋 Workout Steps */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Workout Plan
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={planInput}
              onChange={(e) => setPlanInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddPlanItem())
              }
              placeholder="Add a workout step..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <Button
              onClick={handleAddPlanItem}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add
            </Button>
          </div>

          {planData.workoutPlan.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {planData.workoutPlan.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-2 bg-gray-50 p-2 rounded"
                >
                  <span className="text-sm text-gray-700 flex-1">
                    {index + 1}. {step}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlanItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔘 Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 !py-3 px-4 rounded-lg hover:bg-gray-50 font-medium transition-all"
          >
            Cancel
          </Button>
          <Button
            loading={isUpdating}
            onClick={handleSubmit}
            className="flex-1 !bg-green-600 !text-white !py-3 !px-4 rounded-lg hover:!bg-green-700 font-medium shadow-sm hover:shadow-md transition-all"
          >
            Update Workout
          </Button>
        </div>
      </div>
    </DynamicModal>
  );
};

export default EditWorkoutModal;
