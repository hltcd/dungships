"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import EditCourseModal from "@/components/EditCourseModal";
import DeleteCourseButton from "@/components/DeleteCourseButton";
import PublishToggle from "@/components/PublishToggle";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  price: number;
  isPublished: boolean;
  _count: {
    lessons: number;
    purchases: number;
  };
}

interface CoursesClientProps {
  courses: Course[];
}

export default function CoursesClient({ courses }: CoursesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && course.isPublished) ||
      (filterStatus === "draft" && !course.isPublished);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Quản Lý Khóa Học</h1>
          <p className="text-gray-400 mt-1">{filteredCourses.length} / {courses.length} khóa học</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Thêm Khóa Học
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1f1f2e] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-[#1f1f2e] border border-gray-800 rounded-lg p-1">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterStatus("published")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === "published"
                ? "bg-green-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Đã xuất bản
          </button>
          <button
            onClick={() => setFilterStatus("draft")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === "draft"
                ? "bg-yellow-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Nháp
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-gray-400 font-semibold">Khóa Học</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Bài Học</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Học Viên</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Trạng Thái</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Giá</th>
              <th className="text-right p-4 text-gray-400 font-semibold">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {course.image && (
                      <img
                        src={course.image}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover border border-gray-700"
                      />
                    )}
                    <div>
                      <Link
                        href={`/admin/courses/${course.slug}`}
                        className="text-white font-semibold hover:text-blue-400 transition-colors"
                      >
                        {course.title}
                      </Link>
                      <p className="text-gray-500 text-sm">/{course.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-gray-300 font-medium">{course._count.lessons}</span>
                </td>
                <td className="p-4">
                  <span className="text-gray-300 font-medium">{course._count.purchases}</span>
                </td>
                <td className="p-4">
                  <PublishToggle courseId={course.id} isPublished={course.isPublished} />
                </td>
                <td className="p-4">
                  {course.price === 0 ? (
                    <span className="text-green-400 font-bold">Miễn phí</span>
                  ) : (
                    <span className="text-gray-300 font-semibold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(course.price)}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/courses/${course.slug}`}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Chi tiết
                    </Link>
                    <Link
                      href={`/courses/${course.slug}`}
                      target="_blank"
                      className="text-gray-400 hover:text-gray-300 font-medium transition-colors"
                    >
                      Xem
                    </Link>
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="text-green-400 hover:text-green-300 font-medium transition-colors"
                    >
                      Sửa
                    </button>
                    <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchQuery || filterStatus !== "all"
                ? "Không tìm thấy khóa học nào"
                : "Chưa có khóa học nào"}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}
    </div>
  );
}
