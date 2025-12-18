"use client";

import { useTransition } from "react";
import { togglePublishAction } from "@/actions/courses";

interface PublishToggleProps {
  courseId: string;
  isPublished: boolean;
}

export default function PublishToggle({ courseId, isPublished }: PublishToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await togglePublishAction(courseId, isPublished);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
        isPublished
          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
          : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
      } ${isPending ? "opacity-50 cursor-wait" : ""}`}
    >
      {isPending ? "..." : isPublished ? "Đang xuất bản" : "Nháp"}
    </button>
  );
}
