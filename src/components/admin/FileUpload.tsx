
"use client";

import { Upload, X, Loader2, File } from "lucide-react";
import { useState, useCallback } from "react";
import Image from "next/image";

interface FileUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  type?: "image" | "file";
}

export default function FileUpload({ 
    value, 
    onChange, 
    onRemove, 
    label = "Upload File", 
    accept = "*",
    type = "file" 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
        // 1. Get Presigned URL
        const folderType = type === "image" ? "image" : "source";
        
        const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                filename: file.name, 
                contentType: file.type,
                folder: folderType
            }),
        });

        if (!res.ok) throw new Error("Failed to get upload URL");
        
        const { signedUrl, publicUrl, key } = await res.json();

        // 2. Upload to R2
        const uploadRes = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type }
        });

        if (!uploadRes.ok) throw new Error("Upload failed");

        // 3. Update State
        // For images, we want the public URL to display immediately
        // For source files, we want the KEY to ensure we serve it securely via our API
        if (type === "image") {
            onChange(publicUrl);
        } else {
            onChange(key); // Save 'sourcecodes/filename.zip'
        }

    } catch (err) {
        console.error(err);
        setError("Upload failed. Please try again.");
    } finally {
        setIsUploading(false);
    }
  };

  const handleRemoveFile = async () => {
      if (!value) return;

      // Optimistic update? Or wait? 
      // Safer to wait or just notify.
      // Let's try to delete, but clear UI anyway to not block user.
      const previousValue = value;
      onChange(""); // Clear UI immediately for responsiveness
      
      try {
          await fetch("/api/upload", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: previousValue })
          });
      } catch (err) {
          console.error("Failed to delete file from R2:", err);
          // Optional: revert change if critical, but for now just log it
      }
  };

  if (value && type === "image") {
       return (
           <div className="space-y-2">
               <label className="text-sm font-medium text-gray-400">{label}</label>
               <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-700 group">
                   <Image 
                        src={value} 
                        alt="Upload" 
                        fill 
                        className="object-cover" 
                   />
                    <button
                        type="button"
                        onClick={onRemove || handleRemoveFile}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
               </div>
           </div>
       )
  }

  if (value && type === "file") {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <div className="flex items-center justify-between p-3 bg-[#111118] border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-green-500/20 text-green-500 rounded">
                        <File className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                         <p className="text-sm text-gray-300 font-medium truncate max-w-[200px]">{value.split('/').pop()}</p>
                         <p className="text-xs text-blue-400 truncate max-w-[200px]">{value}</p>
                    </div>
                </div>
                 <button
                     type="button"
                     onClick={onRemove || handleRemoveFile}
                     className="text-gray-500 hover:text-red-400 transition-colors"
                 >
                     <X className="w-5 h-5" />
                 </button>
            </div>
        </div>
    )
}

  return (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors bg-[#111118]/50 text-center relative">
            <input 
                type="file" 
                accept={accept}
                onChange={handleUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            
            <div className="flex flex-col items-center justify-center gap-2">
                {isUploading ? (
                    <>
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="text-sm text-gray-400">Uploading...</span>
                    </>
                ) : (
                    <>
                        <div className="p-3 bg-gray-800 rounded-full text-gray-400">
                             <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-gray-300 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">
                            {type === 'image' ? 'SVG, PNG, JPG or GIF' : 'ZIP, RAR, 7Z (Max 1GB)'}
                        </p>
                    </>
                )}
            </div>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
