"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updateCourseAction } from "@/actions/courses";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
}

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
}

export default function EditCourseModal({ course, onClose }: EditCourseModalProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1f1f2e] border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">Chỉnh Sửa Khóa Học</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form action={updateCourseAction} className="p-6 space-y-5">
          <input type="hidden" name="courseId" value={course.id} />

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tên Khóa Học <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={course.title}
              className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mô Tả <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={course.description}
              className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Giá (VNĐ) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="1000"
              defaultValue={course.price}
              className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL Hình Ảnh
            </label>
            <input
              type="url"
              name="image"
              defaultValue={course.image || ""}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold transition-colors"
            >
              {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
