import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, PlayCircle, Lock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminCourseDetailPage(props: Props) {
  const params = await props.params;
  const { slug } = params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });

  if (!course) {
    redirect("/admin/courses");
  }

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">{course.title}</h1>
          <p className="text-gray-400 mt-1">{course.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm text-gray-500">
              {course.lessons.length} bài học
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">
              {course._count.purchases} học viên
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className={`text-sm font-medium ${course.isPublished ? "text-green-400" : "text-red-400"}`}>
              {course.isPublished ? "Đang xuất bản" : "Nháp"}
            </span>
          </div>
        </div>
        <Link
          href={`/admin/courses/${slug}/lessons/new`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Thêm Bài Học
        </Link>
      </div>

      {/* Lessons List */}
      <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Danh Sách Bài Học</h2>
        </div>

        {course.lessons.length === 0 ? (
          <div className="p-12 text-center">
            <PlayCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Chưa có bài học nào
            </h3>
            <p className="text-gray-500 mb-6">
              Thêm bài học đầu tiên để bắt đầu xây dựng khóa học
            </p>
            <Link
              href={`/admin/courses/${slug}/lessons/new`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thêm Bài Học Đầu Tiên
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="p-6 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {/* Order Number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 font-bold">
                    {lesson.order || index + 1}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {lesson.title}
                      </h3>
                      {lesson.isFree && (
                        <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-xs font-medium text-green-400">
                          Miễn phí
                        </span>
                      )}
                      {!lesson.videoUrl && (
                        <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs font-medium text-yellow-400">
                          Chưa có video
                        </span>
                      )}
                    </div>

                    {lesson.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {lesson.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {lesson.videoUrl && lesson.videoId && (
                        <div className="flex items-center gap-1.5">
                          <PlayCircle className="w-4 h-4" />
                          <span>Video</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span>Slug:</span>
                        <code className="text-blue-400">{lesson.slug}</code>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/courses/${slug}/${lesson.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Xem bài học"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/courses/${slug}/lessons/${lesson.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Settings Quick Access */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1f1f2e] rounded-xl border border-gray-800 p-4">
          <div className="text-gray-400 text-sm mb-1">Giá khóa học</div>
          <div className="text-2xl font-bold text-white">
            {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString()} VNĐ`}
          </div>
        </div>
        <div className="bg-[#1f1f2e] rounded-xl border border-gray-800 p-4">
          <div className="text-gray-400 text-sm mb-1">Tổng bài học</div>
          <div className="text-2xl font-bold text-white">{course.lessons.length}</div>
        </div>
        <div className="bg-[#1f1f2e] rounded-xl border border-gray-800 p-4">
          <div className="text-gray-400 text-sm mb-1">Học viên</div>
          <div className="text-2xl font-bold text-white">{course._count.purchases}</div>
        </div>
      </div>

      {/* Back Button */}
      <div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Quay lại danh sách khóa học
        </Link>
      </div>
    </div>
  );
}
