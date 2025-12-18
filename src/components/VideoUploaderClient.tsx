"use client";

import { useState } from "react";
import VideoUploader from "@/components/VideoUploader";

interface Props {
  initialVideoUrl?: string;
  onUploadSuccess?: (videoId: string, videoUrl: string) => void;
}

export default function VideoUploaderClient({ initialVideoUrl, onUploadSuccess }: Props) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);

  const handleUploadSuccess = (videoId: string, newVideoUrl: string) => {
    // Update local state
    setVideoUrl(newVideoUrl);
    
    // Notify parent
    if (onUploadSuccess) {
        onUploadSuccess(videoId, newVideoUrl);
    }
  };

  return <VideoUploader onUploadSuccess={handleUploadSuccess} initialUrl={videoUrl} />;
}
