import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PlayCircle, Lock, BookOpen } from 'lucide-react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import LessonCompleteButton from '@/components/LessonCompleteButton';
import SecureVideoPlayer from '@/components/SecureVideoPlayer';
import CourseSidebar from '@/components/CourseSidebar';
import MobileCourseMenu from '@/components/MobileCourseMenu';
import { signBunnyStreamUrl, parseBunnyEmbedUrl } from '@/lib/bunny';

interface PageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
};

export default async function LessonPage(props: PageProps) {
  const params = await props.params;
  const { slug, lesson: lessonSlug } = params;

  // Fetch course and ALL lessons (for navigation and sidebar)
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Find the current lesson from the fetched course data
  const currentLessonIndex = course.lessons.findIndex((l) => l.slug === lessonSlug);
  const currentLesson = course.lessons[currentLessonIndex];

  if (!currentLesson) {
    notFound(); 
  }

  const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null;

  // Access Control Logic
  const session = await auth();
  let userRole = session?.user?.role;
  
  // Verify with DB if session exists to avoid stale session data
  if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { role: true }
      });
      if (dbUser) {
          userRole = dbUser.role;
      }
  }

  const isProMember = userRole === "PRO" || userRole === "ADMIN";
  const hasAccess = currentLesson.isFree || isProMember;

  // Fetch User Progress
  let completedLessonIds: string[] = [];
  if (session?.user?.id) {
      const progress = await prisma.userProgress.findMany({
          where: {
              userId: session.user.id,
              lesson: { courseId: course.id }
          },
          select: { lessonId: true, isCompleted: true }
      });
      completedLessonIds = progress.filter(p => p.isCompleted).map(p => p.lessonId);
  }

  const progressPercentage = course.lessons.length > 0 
      ? Math.round((completedLessonIds.length / course.lessons.length) * 100) 
      : 0;
  const isCompleted = completedLessonIds.includes(currentLesson.id);

  // Sign Video URL if it's from Bunny.net and token key is configured
  let finalVideoUrl = currentLesson.videoUrl;
  const bunnyTokenKey = process.env.BUNNY_VIDEO_TOKEN_KEY;
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || "";

  if (hasAccess && bunnyTokenKey) {
      if (finalVideoUrl) {
          const bunnyInfo = parseBunnyEmbedUrl(finalVideoUrl);
          if (bunnyInfo) {
              finalVideoUrl = signBunnyStreamUrl(bunnyInfo.videoId, bunnyInfo.libraryId, bunnyTokenKey);
          }
      } else if (currentLesson.videoId && libraryId) {
          finalVideoUrl = signBunnyStreamUrl(currentLesson.videoId, libraryId, bunnyTokenKey);
      }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#111118]">
        {/* Top Navigation */}
        <header className="h-16 border-b border-gray-800 bg-[#1f1f2e] flex items-center px-4 flex-shrink-0 z-30 justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <Link href={`/courses/${course.slug}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-bold flex-shrink-0">
                    <ChevronLeft className="w-5 h-5" /> <span className="hidden md:inline">Quy lại</span>
                </Link>
                <div className="h-6 w-px bg-gray-700 mx-2 flex-shrink-0"></div>
                <div className="flex flex-col min-w-0 flex-1">
                    <h1 className="text-sm md:text-lg font-bold text-gray-200 truncate">
                        {currentLesson.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-1">
                        {prevLesson && (
                            <Link href={`/courses/${slug}/${prevLesson.slug}`} className="flex items-center gap-1 text-gray-400 hover:text-white text-xs md:text-sm font-bold transition-colors">
                                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" /> Bài Trước
                            </Link>
                        )}
                        {nextLesson && (
                            <Link href={`/courses/${slug}/${nextLesson.slug}`} className="flex items-center gap-1 text-gray-400 hover:text-white text-xs md:text-sm font-bold transition-colors">
                                Bài Tiếp <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <LessonCompleteButton 
                    lessonId={currentLesson.id} 
                    courseSlug={course.slug} 
                    isCompleted={isCompleted} 
                />
                
                <MobileCourseMenu 
                    course={course} 
                    currentLessonSlug={currentLesson.slug} 
                    completedLessonIds={completedLessonIds} 
                    progressPercentage={progressPercentage} 
                />
            </div>
        </header>
 
        <div className="flex flex-1 overflow-hidden">
            {/* Main Content (Video + Text) */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                    {/* Video Player Placeholder */}
                     <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative mb-8 group">
                          {hasAccess ? (
                              finalVideoUrl ? (
                                <SecureVideoPlayer 
                                    videoUrl={finalVideoUrl} 
                                    watermarkText={`${session?.user?.email || 'User'} - ${session?.user?.id?.slice(-4) || 'ID'}`} 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
                                    <PlayCircle className="w-20 h-20 text-white/50" />
                                    <p className="absolute bottom-4 text-gray-500 font-mono text-xs">Chưa có video</p>
                                </div>
                              )
                          ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0f] text-center p-8">
                                  <Lock className="w-16 h-16 text-gray-600 mb-4" />
                                  <h3 className="text-xl font-bold text-white mb-2">Nội dung trả phí</h3>
                                  <p className="text-gray-400 mb-6">Nâng cấp PRO để xem bài học này.</p>
                                  <Link href="/pro" className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-full">
                                      Mở khóa ngay
                                  </Link>
                              </div>
                          )}
                     </div>

                    {/* Lesson Content */}
                    <article className="prose prose-invert max-w-none">
                        <h1 className="text-3xl font-black text-white mb-4">{currentLesson.title}</h1>
                        <div className="flex items-center gap-4 text-gray-400 text-sm font-bold uppercase mb-8">
                             <div className="flex items-center gap-1">
                                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                 Updated Dec 2025
                             </div>
                        </div>
                        
                        {currentLesson.content ? (
                            <div className="text-lg text-gray-300 leading-relaxed mb-6">
                                <ReactMarkdown>
                                    {currentLesson.content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Chưa có nội dung chi tiết.</p>
                        )}
                        
                        {(currentLesson.resources as any[])?.length > 0 && (
                            <div className="bg-[#1f1f2e] rounded-xl p-6 border border-gray-800 my-8">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-blue-400" />
                                    Tài liệu tham khảo
                                </h3>
                                <ul className="space-y-2">
                                    {(currentLesson.resources as any[]).map((res: { title: string, url: string }, idx: number) => (
                                        <li key={idx}>
                                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                {res.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </article>
                    
                    {/* Nav Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-gray-800">
                         {currentLessonIndex > 0 ? (
                             <Link href={`/courses/${course.slug}/${course.lessons[currentLessonIndex - 1].slug}`} className="text-gray-400 hover:text-white font-bold flex items-center gap-2">
                                 ← Bài Trước
                             </Link>
                         ) : <div></div>}
                         
                         {currentLessonIndex < course.lessons.length - 1 && (
                             <Link href={`/courses/${course.slug}/${course.lessons[currentLessonIndex + 1].slug}`} className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2">
                                 Bài Tiếp →
                             </Link>
                         )}
                    </div>
                </div>
            </main>

            {/* Sidebar Navigation */}
            <aside className="w-80 hidden lg:block h-full">
                <CourseSidebar 
                    course={course} 
                    currentLessonSlug={currentLesson.slug} 
                    completedLessonIds={completedLessonIds} 
                    progressPercentage={progressPercentage} 
                />
            </aside>
        </div>
    </div>
  );
}
