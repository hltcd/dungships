import Link from 'next/link';
import { ArrowRight, Play, Zap, Award, Globe, ArrowDown, ChevronRight } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { prisma } from '@/lib/prisma';
import ThreeBackground from '@/components/ThreeBackground';

export default async function Home() {
  const recentCourses = await prisma.course.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      where: { isPublished: true }
  });

  return (
    <>
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 pt-32 md:pt-40">
        
        <div className="relative z-10 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[1.1]">
              HỌC LẬP TRÌNH <br />
              <span 
                className="animate-thunder italic inline-block ml-1"
              >
                NHANH HƠN.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              HocLapTrinhCungDung là nơi học lập trình <span className="text-white font-bold">cực nhanh</span> && <span className="text-white font-bold">cực vui</span> giúp bạn nâng tầm kỹ năng coding.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <Link href="/courses">
                  <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold rounded-full shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all uppercase tracking-wide">
                      Bắt Đầu Ngay
                  </button>
              </Link>
            </div>
        </div>
      </div>

      {/* HARD TRUTH Section */}
      <section className="py-24 relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-6 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  Sự Thật
              </span>
              
              <div className="text-6xl mb-8 animate-bounce">👇</div>
              
              <p className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Bạn <span className="text-red-500">KHÔNG THỂ</span> học code chỉ bằng cách xem video.
              </p>
              <p className="text-gray-500 mt-4 font-mono text-sm">thực tế phũ phàng 🥲</p>
          </div>
      </section>

      {/* SOLUTION Section (Project Based) */}
      <section className="py-24 relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  Phương Pháp
              </span>
              
              <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
                  HocLapTrinhCungDung tập trung vào <span className="text-cyan-400 font-bold">HỌC QUA DỰ ÁN</span>. 
                  Tôi tạo ra các video ngắn gọn, tập trung cao độ giúp việc học code trở nên "gây nghiện".
              </p>
              
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
                  {/* Card 1 */}
                  <div className="bg-[#18181b] p-8 rounded-2xl border border-gray-800 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all duration-300 group">
                      <Zap className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-2">Nội Dung Mới</h3>
                      <p className="text-gray-500 text-sm">Cập nhật hàng tuần để bắt kịp công nghệ.</p>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-[#18181b] p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300 group">
                      <Award className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-2">Hệ Thống XP</h3>
                      <p className="text-gray-500 text-sm">Tích lũy điểm kinh nghiệm vô dụng nhưng vui.</p>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-[#18181b] p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all duration-300 group">
                      <Globe className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-2">Lập trình Web</h3>
                      <p className="text-gray-500 text-sm">Kỹ năng thực tế từ Frontend đến Backend.</p>
                  </div>
               </div>
          </div>
      </section>

      {/* Newest Courses Grid */}
      <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <span className="inline-block px-6 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      Khám Phá
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-white">Khóa Học Mới Nhất</h2>
                  <p className="text-gray-400 mt-4 font-medium">Có rất nhiều nội dung miễn phí, hãy vọc vạch thử đi 🚀</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recentCourses.length > 0 ? recentCourses.map((course: any) => {
                        // Intelligent Mock Tags based on Title
                        const tags = [];
                        const lowerTitle = course.title.toLowerCase();
                        
                        if (lowerTitle.includes('next')) tags.push('#nextjs');
                        if (lowerTitle.includes('react')) tags.push('#react');
                        if (lowerTitle.includes('node')) tags.push('#nodejs');
                        if (lowerTitle.includes('css') || lowerTitle.includes('tailwind')) tags.push('#css');
                        
                        // Default tags if none found
                        if (tags.length === 0) tags.push('#coding');
                        
                        return (
                            <CourseCard key={course.id} course={{
                                ...course,
                                image: course.image || '/placeholder-course.jpg', // Fallback image
                                tags: tags, 
                                isFree: course.price === 0 // Ensure this prop is passed
                            } as any} />
                        );
                    }) : (
                        <p className="text-gray-500 col-span-3 text-center">Chưa có khóa học nào được xuất bản.</p>
                    )}
              </div>
          </div>
      </section>
    </>
  );
}
