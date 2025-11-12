"use client";

import { useGetSingleVideoContentQuery } from "@/redux/features/admin/video-content.api";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IVideo } from "./video.interface";
import VideoForm from "./VideoFrom";
import VideoList from "./WorkOutList";

const VideoManager = () => {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [formData, setFormData] = useState<Partial<IVideo | any>>({});
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();

  const { data: videoContent } = useGetSingleVideoContentQuery(
    params?.id as string
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formData._id) {
      setVideos((prev) =>
        prev.map((v) =>
          v._id?.toString() === formData._id?.toString()
            ? (formData as IVideo)
            : v
        )
      );
      setIsEditing(false);
    } else {
      const newVideo: IVideo = {
        ...(formData as IVideo),
        _id: new Date().getTime().toString() as any,
      };
      setVideos((prev) => [...prev, newVideo]);
    }

    setFormData({});
  };

  const handleEdit = (id: string) => {
    const selected = videos.find((v) => v._id?.toString() === id);
    if (selected) {
      setFormData(selected);
      setIsEditing(true);
    }
  };

  const handleDelete = (id: string) => {
    setVideos((prev) => prev.filter((v) => v._id?.toString() !== id));
  };

  return (
    <div className="flex gap-10">
      <VideoForm
        parentContentId={params?.id as string}
        videoContent={videoContent}
        formData={formData}
        isEditing={isEditing}
        handleChange={handleChange}
        setFormData={setFormData}
        setIsEditing={setIsEditing}
      />
      <VideoList
        videos={videos}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default VideoManager;
