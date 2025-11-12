// ============================================
// 1. VideoManager.tsx (Main Component)
// ============================================
"use client";

import {
  useGetSingleVideoContentQuery,
  useGetVideoByContentIdQuery,
} from "@/redux/features/admin/video-content.api";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IVideo } from "./video.interface";
import VideoForm from "./VideoFrom";
import VideoList from "./WorkOutList";

const VideoManager = () => {
  const [formData, setFormData] = useState<Partial<IVideo | any>>({});
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();

  const { data: videoContent } = useGetSingleVideoContentQuery(
    params?.id as string
  );

  // Video list data fetch করার জন্য
  const { data: videoListData } = useGetVideoByContentIdQuery(
    params?.id as string
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (id: string) => {
    // Video list থেকে selected video খুঁজে বের করা
    const videos = videoListData?.data || [];
    const selected = videos.find((v: IVideo) => v._id?.toString() === id);

    if (selected) {
      // Form এ সব data set করা
      setFormData({
        _id: selected._id,
        title: selected.title,
        subtitle: selected.subtitle,
        description: selected.description,
        url: selected.url,
      });
      setIsEditing(true);

      // Scroll to form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-10 w-[80%] mx-auto bg-zinc-100 rounded-2xl p-6">
      <div className="w-1/2 bg-zinc-50 p-3 rounded-xl">
        <VideoForm
          parentContentId={params?.id as string}
          videoContent={videoContent}
          formData={formData}
          isEditing={isEditing}
          handleChange={handleChange}
          setFormData={setFormData}
          setIsEditing={setIsEditing}
        />
      </div>
      <div className="w-1/2 p-3 ">
        <VideoList
          parentContentId={params?.id as string}
          handleEdit={handleEdit}
          tiersName={(videoContent?.data?.tier?.name as string) || ""}
        />
      </div>
    </div>
  );
};

export default VideoManager;
