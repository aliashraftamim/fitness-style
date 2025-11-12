"use client";

import React from "react";
import { IVideo } from "./video.interface";

interface VideoListProps {
  videos: IVideo[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="w-full p-6 bg-zinc-200 rounded-2xl">
      {videos.map((video) => (
        <div
          key={video._id?.toString()}
          className="bg-white shadow-md rounded-lg p-5 mb-4 flex flex-col gap-2"
        >
          <div>
            <p className="text-lg font-semibold text-gray-800">{video.title}</p>
            <p className="text-gray-600 text-sm">{video.subtitle}</p>
          </div>

          <video
            src={video.url}
            controls
            className="rounded-lg mt-2 w-full max-h-64 object-cover"
          />

          <p className="text-gray-700 text-sm mt-2">{video.description}</p>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => handleEdit(video._id?.toString() || "")}
              className="px-4 py-1 bg-green-700 text-white rounded hover:bg-green-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(video._id?.toString() || "")}
              className="px-4 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
