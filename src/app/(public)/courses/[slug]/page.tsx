import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PlayCircle, Lock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { auth } from '@/auth';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
  });

  if (!course) {
    return {
      title: "Khóa học không tồn tại",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${course.title} | Học Lập Trình Series`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      url: `/courses/${course.slug}`,
      siteName: 'HocLapTrinhCungDung',
      images: [course.image || '/course-placeholder.jpg', ...previousImages],
      type: 'website',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
      images: [course.image || '/course-placeholder.jpg'],
    },
  };
}

export default async function CourseDetailPage(props: PageProps) {
  const params = await props.params;
  const session = await auth();
  
  // Check PRO status
  let hasProAccess = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });
    if (user?.role === 'PRO' || user?.role === 'ADMIN') {
        hasProAccess = true;
    }
  }

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { 
        lessons: {
            orderBy: { order: 'asc' }
        } 
    }
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="bg-[#111118] border-b border-gray-800 pt-24 md:pt-40 pb-16 md:pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-[32px] md:text-[48px] font-black text-white mb-4 md:mb-6 leading-tight uppercase tracking-tight">
                        {course.title}
                    </h1>
                    <p className="text-base text-gray-400 mb-6 md:mb-8 leading-relaxed font-medium">
                        {course.description}
                    </p>
                    <div className="w-24 h-1 bg-[#6c7983] rounded-full mb-10 opacity-60 mx-auto md:mx-0"></div>
                    {course.lessons.length > 0 ? (
                        <Link href={`/courses/${course.slug}/${course.lessons[0].slug}`}>
                            <button className="bg-[#0de768] hover:bg-[#0bc158] text-gray-900 font-black text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(13,231,104,0.3)] uppercase tracking-wide">
                                Bắt Đầu Học
                            </button>
                        </Link>
                    ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                            <p className="text-yellow-400 font-medium">
                                Khóa học đang được cập nhật. Vui lòng quay lại sau!
                            </p>
                        </div>
                    )}
                    <div className="mt-4 text-xs md:text-sm text-gray-500 font-bold">
                        <span className="text-green-400">✓</span> Miễn phí 2 chương đầu cho mọi người
                    </div>
                </div>
                <div className="flex-1 w-full max-w-lg">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900 group">
                        <img 
                            src={course.image || '/course-placeholder.jpg'} 
                            alt={course.title} 
                            className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                        />
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                <PlayCircle className="w-12 h-12 text-white fill-current" />
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Syllabus / Lessons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-10 relative z-20">
        <div className="bg-[#1f1f2e] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-white/5 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6 md:mb-8 text-center uppercase tracking-tight">Giáo Trình</h2>
            
            <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                    <Link key={index} href={`/courses/${course.slug}/${lesson.slug}`}>
                        <div className="flex items-center p-3 md:p-4 rounded-xl hover:bg-[#2a2a3e] transition-all border border-transparent hover:border-white/5 cursor-pointer group">
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center font-bold text-sm md:text-base text-gray-400 mr-3 md:mr-5 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors shadow-inner">
                                {index + 1}
                            </div>
                            <div className="flex-grow min-w-0 mr-2">
                                <h3 className="text-base md:text-lg font-bold text-gray-300 group-hover:text-white transition-colors truncate">
                                    {lesson.title}
                                </h3>
                                <div className="text-[10px] md:text-xs text-gray-600 font-bold uppercase mt-1">
                                    Bài học {lesson.videoUrl ? 'Video' : 'Văn bản'}
                                </div>
                            </div>
                            <div className="flex items-center flex-shrink-0">
                                {lesson.isFree || hasProAccess ? (
                                    <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wide border ${
                                        lesson.isFree 
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                    }`}>
                                        {lesson.isFree ? 'Miễn Phí' : 'Đã mở khóa'}
                                    </span>
                                ) : (
                                    <div className="bg-gray-800/50 p-2 rounded-full">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
