"use client";

import { useState } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface VideoUploadProps {
  onUploadSuccess: (videoId: string, videoUrl: string) => void;
  lessonTitle?: string;
  initialUrl?: string;
}

export default function VideoUploader({ onUploadSuccess, lessonTitle, initialUrl }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("video/")) {
        setError("Please select a video file");
        return;
      }
      // Validate file size (max 2GB)
      if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
        setError("File size must be less than 2GB");
        return;
      }
      setFile(selectedFile);
      setError("");
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", lessonTitle || file.name);

      // Simulate progress (real progress would need chunked upload)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setSuccess(true);
      onUploadSuccess(data.videoId, data.videoUrl);

      // Reset after 2 seconds
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
        setProgress(0);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      {!file && !initialUrl && (
        <label className="block">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-[#111118]">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Click to upload video</p>
            <p className="text-gray-500 text-sm">MP4, WebM, MOV up to 2GB</p>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </label>
      )}

      {/* Initial URL Display */}
      {!file && initialUrl && (
         <div className="bg-[#1f1f2e] border border-gray-800 rounded-lg p-4">
             <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                         <CheckCircle className="w-5 h-5 text-green-400" />
                     </div>
                     <div>
                         <p className="text-white font-medium">Video đã tải lên</p>
                         <p className="text-gray-500 text-sm truncate max-w-[200px]">{initialUrl}</p>
                     </div>
                 </div>
                 {/* Allow replacing */}
                 <label className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm font-bold">
                     Thay đổi
                     <input
                         type="file"
                         accept="video/*"
                         onChange={handleFileChange}
                         className="hidden"
                     />
                 </label>
             </div>
         </div>
      )}

      {/* Selected File */}
      {file && !success && (
        <div className="bg-[#1f1f2e] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm">{formatFileSize(file.size)}</p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={() => {
                  setFile(null);
                  setError("");
                }}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Uploading...</span>
                <span className="text-blue-400">{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!uploading && (
            <button
              onClick={handleUpload}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Upload to Bunny CDN
            </button>
          )}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <div>
            <p className="text-green-400 font-medium">Upload successful!</p>
            <p className="text-gray-400 text-sm">Video is processing and will be available soon.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
