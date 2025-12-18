"use client";

import Link from 'next/link';
import { Course } from '@/lib/courses';
import { useState } from 'react';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/courses/${course.slug}`} className="h-full block">
      <div className="group relative bg-white/[0.03] backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] h-full flex flex-col">
        <div className="relative w-full pt-[56.25%] overflow-hidden bg-black/20">
             {(!course.image || imgError) ? (
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center p-6 group-hover:scale-110 transition-transform duration-700">
                     <span className="text-xl font-black text-white/10 uppercase tracking-tighter text-center italic">
                         {course.title}
                     </span>
                 </div>
             ) : (
                 <img 
                     src={course.image} 
                     alt={course.title}
                     onError={() => setImgError(true)}
                     className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                 />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        </div>
        
        <div className="p-6 flex flex-col flex-1 relative z-10">
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight leading-7 group-hover:text-blue-400 transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium opacity-90">
            {course.description}
          </p>
          
          <div className="mt-auto flex flex-wrap gap-2">
             {/* Render tags */}
             {((course as any).tags || []).map((tag: string) => {
                 const t = tag.toLowerCase().replace('#', '');
                 let badgeStyle = "bg-[#33333f] text-gray-400";
                 
                 if (t === 'pro') badgeStyle = "bg-[#0de768] text-black";
                 else if (t.includes('react')) badgeStyle = "bg-[#00d8ff] text-black";
                 else if (t.includes('next')) badgeStyle = "bg-white text-black";
                 else if (t.includes('postgres')) badgeStyle = "bg-[#336791] text-white";
                 else if (t.includes('typescript')) badgeStyle = "bg-[#3178c6] text-white";
                 else if (t.includes('deno')) badgeStyle = "bg-white text-black";
                 else if (t.includes('svelte')) badgeStyle = "bg-[#ff3e00] text-white";
                 else if (t.includes('firebase')) badgeStyle = "bg-[#ffcb2b] text-black";
                 else if (t.includes('linux')) badgeStyle = "bg-gray-700 text-white";
                 
                 return (
                     <span key={tag} className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tight ${badgeStyle}`}>
                        {tag.startsWith('#') ? tag : `#${tag}`}
                     </span>
                 );
             })}

             {/* Auto-add PRO tag if non-free and not in tags */}
             {(course as any).isFree === false && !((course as any).tags || []).some((t: string) => t.toLowerCase().includes('pro')) && (
                 <span className="text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tight bg-[#0de768] text-black">
                    #PRO
                 </span>
             )}
             
             {(!((course as any).tags) || ((course as any).tags.length === 0)) && (course as any).isFree !== false && (
                 <span className="text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tight bg-[#33333f] text-gray-400">
                    #MIỄN PHÍ
                 </span>
             )}
          </div>
        </div>
      </div>
    </Link>
  );
}
