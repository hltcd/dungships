"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteCourseAction } from "@/actions/courses";

interface DeleteCourseButtonProps {
  courseId: string;
  courseTitle: string;
}

export default function DeleteCourseButton({ courseId, courseTitle }: DeleteCourseButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCourseAction(courseId);
      if (result.success) {
        setShowConfirm(false);
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-400 hover:text-red-300 transition-colors"
        title="Xóa khóa học"
      >
        Xóa
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f1f2e] rounded-2xl border border-red-500/20 w-full max-w-md p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Xác Nhận Xóa</h3>
                <p className="text-gray-400">
                  Bạn có chắc muốn xóa khóa học <span className="text-white font-semibold">"{courseTitle}"</span>?
                </p>
                <p className="text-red-400 text-sm mt-2">
                  Hành động này không thể hoàn tác. Tất cả bài học sẽ bị xóa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold transition-colors"
              >
                {isPending ? (
                  "Đang xóa..."
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Xóa Khóa Học
                  </>
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
