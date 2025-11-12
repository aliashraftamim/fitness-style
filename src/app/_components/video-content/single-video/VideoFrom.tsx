"use client";

import {
  useCreateVideoMutation,
  useUpdateVideoMutation,
} from "@/redux/features/admin/video-content.api";
import { Button } from "antd";
import React from "react";
import { IVideo } from "./video.interface";

interface VideoFormProps {
  parentContentId: string;
  videoContent: any;
  formData: Partial<IVideo | any>;
  isEditing: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IVideo>>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoForm: React.FC<VideoFormProps> = ({
  parentContentId,
  videoContent,
  formData,
  isEditing,
  handleChange,
  setFormData,
  setIsEditing,
}) => {
  console.log({
    parentContentId,
    videoContent,
    formData,
    isEditing,
    handleChange,
    setFormData,
    setIsEditing,
  });

  const content = videoContent?.data;
  const fullVideoUrl = content?.videoUrl?.startsWith("http")
    ? videoContent?.videoUrl
    : `https://${content?.videoUrl}`;

  const [addVideo, { isLoading: addVideoLoading }] = useCreateVideoMutation();
  const [updateVideo, { isLoading: updateVideoLoading }] =
    useUpdateVideoMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, video: file }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Add video file
      console.log("🚀 ~ onSubmit ~ formData:", formData);
      if (formData.video) {
        formDataToSend.append("video", formData.video);
      }

      // Add other data as JSON string inside "data" field
      const dataObject = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        parentContent: parentContentId,
      };
      formDataToSend.append("data", JSON.stringify(dataObject));

      if (isEditing && formData._id) {
        // Update existing video
        await updateVideo({
          id: formData._id,
          data: formDataToSend,
        }).unwrap();

        // Reset form after successful update
        setFormData({});
        setIsEditing(false);
      } else {
        // Add new video
        await addVideo(formDataToSend).unwrap();

        // Reset form after successful addition
        setFormData({});
      }
    } catch (error) {
      console.error("Error submitting video:", error);
    }
  };

  return (
    <div className="w-1/3 p-6 rounded-lg">
      <video
        src={fullVideoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="rounded-2xl shadow-sm w-full max-w-3xl mb-3"
      />

      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? "Update Video" : "Add Video"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload Video</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required={!isEditing}
          />
          {formData.url && (
            <p className="text-sm text-gray-600 mt-1">
              {/* Selected: {formData} */}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle || ""}
            onChange={handleChange}
            placeholder="Enter subtitle"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Enter description"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <Button
          htmlType="submit"
          disabled={addVideoLoading || updateVideoLoading}
          loading={addVideoLoading || updateVideoLoading}
          className="!w-full !bg-brand-primary !text-white !py-2 !px-4 !rounded-lg hover:!bg-green-800 disabled:!opacity-50 disabled:cursor-not-allowed"
        >
          {isEditing ? "Update Video" : "Add Video"}
        </Button>
      </form>
    </div>
  );
};

export default VideoForm;
