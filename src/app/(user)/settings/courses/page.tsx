import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlayCircle } from "lucide-react";

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get purchased courses with progress
  const purchases = await prisma.purchase.findMany({
    where: { 
      userId: session.user.id,
      courseId: { not: null }
    },
    include: {
      course: {
        include: {
          lessons: {
            select: { id: true, slug: true }
          },
          _count: {
            select: { lessons: true }
          }
        }
      }
    }
  });

  // Get completed lessons for these courses
  const progress = await prisma.userProgress.findMany({
    where: {
      userId: session.user.id,
      isCompleted: true,
      lesson: {
        courseId: {
          in: purchases.map(p => p.courseId!).filter(Boolean)
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Khóa Học Của Tôi</h1>
        <p className="text-gray-400 mt-1">Tiếp tục hành trình học tập của bạn</p>
      </div>

      <div className="grid gap-6">
        {purchases.length === 0 ? (
          <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Chưa có khóa học nào</h3>
            <p className="text-gray-400 mb-6">Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học ngay!</p>
            <Link 
              href="/courses" 
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Khám Phá Khóa Học
            </Link>
          </div>
        ) : (
          purchases.map((purchase) => {
            const course = purchase.course!;
            const totalLessons = course._count.lessons;
            const completedCount = progress.filter(p => 
              course.lessons.some(l => l.id === p.lessonId)
            ).length;
            const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            const nextLesson = course.lessons[0]; // Logic for next lesson needs refinement but simple for now

            return (
              <div key={course.id} className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-gray-700 transition-colors">
                <div className="flex-shrink-0 w-full md:w-48 h-32 rounded-xl overflow-hidden bg-gray-800 relative">
                   {course.image ? (
                     <img src={course.image} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">No Image</div>
                   )}
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Đã hoàn thành {completedCount}/{totalLessons} bài</span>
                      <span className="text-blue-400 font-bold">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link 
                    href={`/courses/${course.slug}/${nextLesson?.slug || ''}`}
                    className="inline-flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors w-fit"
                  >
                    <PlayCircle className="w-5 h-5 fill-current" />
                    Tiếp tục học
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
