import { auth } from "@/auth";
import PricingSection from "@/components/PricingSection";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, Clock, Zap } from "lucide-react";
import { getPlans } from "@/actions/plans";

export default async function ProLandingPage() {
  const session = await auth();
  
  let isPro = false;
  let expiresAt = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, proExpiresAt: true }
    });
    if (user?.role === "PRO" || user?.role === "ADMIN") {
      isPro = true;
      expiresAt = user.role === "ADMIN" ? null : user.proExpiresAt;
    }
  }

  if (isPro) {
      return (
        <div className="pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-2xl mx-auto bg-[#1f1f2e] border border-blue-500/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-blue-400" />
                </div>
                <h1 className="text-3xl font-black text-white mb-4">Bạn đang là Pro Member!</h1>
                <p className="text-gray-300 text-lg mb-8">
                    Cảm ơn bạn đã đồng hành cùng HocLapTrinhCungDung. Bạn có thể truy cập toàn bộ khóa học và tính năng cao cấp.
                </p>
                
                <div className="bg-[#111118] rounded-xl p-6 border border-gray-800 mb-8 inline-block w-full text-left">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 font-bold text-sm uppercase">Trạng thái</span>
                        <span className="text-green-400 font-black bg-green-500/10 px-3 py-1 rounded-full text-xs border border-green-500/20">ACTIVE</span>
                     </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-bold text-sm uppercase">Hết hạn vào</span>
                        <span className="text-white font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            {expiresAt ? new Date(expiresAt).toLocaleDateString("vi-VN") : "Vĩnh viễn"}
                        </span>
                     </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/courses" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25">
                        Vào học ngay
                    </Link>
                    {/* Extend Button - Linking to payment with extend query or just handling re-purchase logic if needed */}
                     <Link href="/pro/payment?extend=1" className="bg-[#2a2a3e] hover:bg-[#32324a] text-white font-bold py-3 px-8 rounded-xl border border-gray-700 transition-all">
                        Gia hạn thêm
                    </Link>
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="pt-32 md:pt-40 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section - Compact */}
      <div className="flex flex-col items-center mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-[32px] md:text-[48px] font-black text-white mb-4 uppercase tracking-tight">
          LÀM CHỦ CÔNG NGHỆ - <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0f7b] to-[#f89b29]">
            BỨT PHÁ SỰ NGHIỆP
          </span>
        </h1>
        <p className="text-base text-gray-400 max-w-3xl mx-auto font-medium">
          Hệ thống bài giảng <span className="text-white font-bold">chuyên sâu</span>, tư duy <span className="text-green-400 font-bold underline decoration-wavy underline-offset-4">thực chiến</span>.
        </p>
        <div className="w-24 h-1 bg-[#6c7983] rounded-full mt-10 opacity-60"></div>
      </div>

      <PricingSection session={session} plans={await getPlans()} />
    </div>
  );
}
