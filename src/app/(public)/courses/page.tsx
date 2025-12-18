import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CourseCard from '@/components/CourseCard';

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { lessons: true },
  });

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-16 text-center">
        <h1 className="text-[40px] md:text-[48px] font-black text-white  uppercase tracking-tight">Courses</h1>
        <p className="text-base text-gray-400 max-w-2xl font-medium">
            Hành trình học tập chuyên sâu với video chất lượng và theo dõi tiến độ bài bản
        </p>
        <div className="w-24 h-1 bg-[#6c7983] rounded-full mt-10 opacity-60"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map((course) => (
          // @ts-ignore
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
