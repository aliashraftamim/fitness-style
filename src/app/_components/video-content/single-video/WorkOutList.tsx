"use client";

import {
  useDeleteVideoMutation,
  useGetVideoByContentIdQuery,
} from "@/redux/features/admin/video-content.api";
import React, { useState } from "react";
import { MdBorderVertical } from "react-icons/md";
import { IVideo } from "./video.interface";

interface VideoListProps {
  parentContentId: string;
  handleEdit: (id: string) => void;
  tiersName: string;
}

const VideoList: React.FC<VideoListProps> = ({
  parentContentId,
  handleEdit,
  tiersName,
}) => {
  const { data: videoContent } = useGetVideoByContentIdQuery(parentContentId);
  const [deleteVideo, { isLoading: deleteVideoLoading }] =
    useDeleteVideoMutation();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const videos = videoContent?.data || [];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(id).unwrap();
      } catch (error) {
        console.error("Failed to delete video:", error);
        alert("Failed to delete video. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {videos.map((video: IVideo) => (
        <div
          key={video._id?.toString()}
          className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col md:flex-row gap-6 items-start"
        >
          {/* 3-dot menu */}
          <div className="absolute top-3 right-3">
            <button
              onClick={() => {
                const id = video._id?.toString() ?? null;
                setOpenMenuId(openMenuId === id ? null : id);
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <MdBorderVertical className="w-5 h-5 text-gray-600" />
            </button>

            {openMenuId === video._id?.toString() && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-md z-20">
                <button
                  onClick={() => {
                    handleEdit(video._id?.toString() || "");
                    setOpenMenuId(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(video._id?.toString() || "");
                    setOpenMenuId(null);
                  }}
                  disabled={deleteVideoLoading}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 disabled:text-gray-400"
                >
                  {deleteVideoLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>

          {/* Left - Video */}
          <div className="md:w-1/3 w-full">
            <video
              src={
                video?.url?.startsWith("http")
                  ? video?.url
                  : `https://${video?.url}`
              }
              muted
              loop
              playsInline
              controls
              className="rounded-xl shadow-sm w-full aspect-video object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 !mb-0">
                {video.title}
              </h3>
              <div className="mb-2">
                <span className="text-sm text-gray-500">Tiers: </span>
                <span className="text-sm !text-green-500 mb-1">
                  {tiersName}
                </span>
              </div>
              {video.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{video.subtitle}</p>
              )}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>
      ))}

      {videos.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">
          No videos available
        </div>
      )}
    </div>
  );
};

export default VideoList;
