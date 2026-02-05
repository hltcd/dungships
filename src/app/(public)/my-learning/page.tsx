import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Code, PlayCircle, Lock } from "lucide-react";
import GitHubAccessUI from "@/components/GitHubAccessUI";

export const metadata = {
  title: "Góc Học Tập | HocLapTrinhCungDung Course",
  description: "Quản lý khóa học và source code của bạn",
};

export default async function MyLearningPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, proExpiresAt: true, githubUsername: true }
  });

  if (!user) redirect("/login");

  // Fetch Purchases (Explicitly bought items)
  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    include: {
      course: true,
      product: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const purchasedCourses = purchases
    .filter((p: any) => p.course)
    .map((p: any) => p.course!);
    
  const purchasedProducts = purchases
    .filter((p: any) => p.product)
    .map((p: any) => p.product!);

  // If PRO, fetch ALL published courses (excluding ones already purchased to avoid dupes)
  let proCourses: any[] = [];
  if (user.role === 'PRO' || user.role === 'ADMIN') {
    const allCourses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    
    // Filter out courses heavily if already in purchasedCourses (by id)
    const purchasedIds = new Set(purchasedCourses.map((c: any) => c.id));
    proCourses = allCourses.filter((c: any) => !purchasedIds.has(c.id));
  }

  const displayCourses = [...purchasedCourses, ...proCourses];

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-16 text-center">
        <h1 className="text-[40px] md:text-[48px] font-black text-white mb-4 uppercase tracking-tight">GÓC HỌC TẬP</h1>
        <p className="text-base text-gray-400 max-w-2xl font-medium">
            Nơi lưu trữ các dự án mã nguồn và khóa học bạn đã sở hữu
        </p>
        <div className="w-24 h-1 bg-[#6c7983] rounded-full mt-10 opacity-60"></div>
      </div>

        {/* PRO Banner */}
        {(user.role === 'PRO' || user.role === 'ADMIN') && (
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-2xl p-6 mb-12 flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">PRO Membership Active</h3>
                    <p className="text-blue-200 text-sm">Bạn được truy cập không giới hạn toàn bộ Khóa Học & Source Code.</p>
                </div>
            </div>
        )}

        {/* Section: Source Codes */}
        <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Code className="w-6 h-6 text-purple-500" />
                Danh sách Source Code
            </h2>

             {purchasedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedProducts.map((product: any) => (
                        <div key={product.id} className="group relative block bg-[#1f1f2e] border border-gray-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all hover:transform hover:-translate-y-1 hover:shadow-2xl">
                             <div className="aspect-video w-full relative overflow-hidden p-8 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                                {/* Clickable Image Only */}
                                <Link href={product.link ? product.link : `/source-code/${product.slug}`} target={product.link ? "_blank" : "_self"} className="absolute inset-0 flex items-center justify-center z-0">
                                    {product.image ? (
                                         <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Code className="w-16 h-16 text-gray-600 group-hover:text-purple-500 transition-colors" />
                                    )}
                                </Link>
                            </div>
                            <div className="p-5 relative z-10 bg-[#1f1f2e]">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                    <Link href={`/source-code/${product.slug}`} className="hover:text-purple-400 transition-colors">
                                        {product.title}
                                    </Link>
                                </h3>
                                <div className="mt-4 space-y-2">
                                     {/* If GitHub Repo exists, show Access UI */}
                                     {product.githubRepo ? (
                                         <GitHubAccessUI 
                                            productId={product.id} 
                                            githubRepo={product.githubRepo} 
                                            initialGithubUsername={user.githubUsername}
                                         />
                                     ) : (
                                         <button className="w-full bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2">
                                            <Code className="w-4 h-4" />
                                            Truy cập Source
                                         </button>
                                     )}
                                     
                                     {/* Always allow download link if available as fallback/primary */}
                                     {product.link && !product.githubRepo && (
                                         <div className="hidden"></div> // Logic handled above by button wrapping or we can separate
                                     )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-8 text-center">
                    <p className="text-gray-400 mb-4">Bạn chưa mua Source Code nào.</p>
                    <Link href="/source-code" className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-full transition-colors">
                        Xem thư viện Source
                    </Link>
                </div>
            )}
        </section>
    </div>
  );
}
