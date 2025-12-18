import Link from 'next/link';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';

interface Lesson {
    id: string;
    title: string;
    slug: string;
    videoDuration?: number | null;
    isFree: boolean;
}

interface Course {
    slug: string;
    lessons: Lesson[];
}

interface CourseSidebarProps {
    course: Course;
    currentLessonSlug: string;
    completedLessonIds: string[];
    progressPercentage: number;
}

export default function CourseSidebar({ 
    course, 
    currentLessonSlug, 
    completedLessonIds, 
    progressPercentage 
}: CourseSidebarProps) {
    return (
        <div className="flex flex-col h-full bg-[#111118] border-l border-white/5">
            <div className="p-8 border-b border-white/5 text-center">
                <h3 className="text-white font-black text-3xl mb-4 tracking-tight">Giáo Trình</h3>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="bg-green-500 h-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <span className="text-xs font-bold text-green-500">{progressPercentage}%</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {course.lessons.map((lesson, idx) => {
                    const isActive = lesson.slug === currentLessonSlug;
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isLocked = !lesson.isFree && !isCompleted; // Simple visual logic, real auth is server-side

                    return (
                        <Link key={lesson.id} href={`/courses/${course.slug}/${lesson.slug}`}>
                            <div className={`
                                group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                                ${isActive 
                                    ? 'bg-[#1f1f2e] border border-blue-500/30 shadow-[0_4px_20px_-10px_rgba(59,130,246,0.5)]' 
                                    : 'bg-[#18181b] border border-transparent hover:border-gray-700 hover:bg-[#1f1f2e]'
                                }
                            `}>
                                {/* Number Circle */}
                                <div className={`
                                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black
                                    ${isCompleted
                                        ? 'bg-green-500 text-black'
                                        : isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-[#272732] text-gray-500 group-hover:bg-[#323240] group-hover:text-gray-300'
                                    }
                                    transition-all
                                `}>
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-base font-bold truncate ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                        {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                                            <PlayCircle className="w-3 h-3" /> Video Lesson
                                        </p>
                                    </div>
                                </div>

                                {/* Badge */}
                                <div className="flex-shrink-0">
                                    {isCompleted ? (
                                         <span className="text-[10px] font-black bg-green-500/10 text-green-500 px-2 py-1 rounded-sm border border-green-500/20">
                                            DONE
                                         </span>
                                    ) : !lesson.isFree ? (
                                        <span className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-sm border border-yellow-500/20 flex items-col flex-col text-center leading-none gap-0.5">
                                            <span>PRO</span>
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-2 py-1 rounded-sm border border-blue-500/20">
                                            FREE
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
