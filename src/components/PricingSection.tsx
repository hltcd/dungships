"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Flame } from "lucide-react";

export default function PricingSection({ session }: { session: any }) {
  const [planType, setPlanType] = useState<"monthly" | "yearly">("monthly");
  
  const paymentBaseUrl = session?.user ? "/pro/payment" : "/login?callbackUrl=/pro/payment";

  return (
    <div className="max-w-6xl mx-auto px-4">
      
      {/* Premium Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* STANDARD PLAN (Subscription) */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative h-full bg-[#121217] border border-white/5 rounded-3xl p-8 flex flex-col hover:bg-[#16161c] transition-colors">
            
            <div className="mb-6">
              <h3 className="text-xl font-medium text-blue-400 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Standard Access
              </h3>
              
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg w-fit mb-6">
                 <button 
                  onClick={() => setPlanType("monthly")}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    planType === "monthly" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-gray-400 hover:text-white"
                  }`}
                >
                  Theo Tháng
                </button>
                <button 
                  onClick={() => setPlanType("yearly")}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                    planType === "yearly" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-gray-400 hover:text-white"
                  }`}
                >
                  Theo Năm <span className="text-[9px] bg-white/20 px-1 rounded">-30%</span>
                </button>
              </div>

              <div className="h-20">
                <div className="flex items-baseline gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        {planType === 'monthly' ? '199k' : '1.69tr'}
                    </span>
                    <span className="text-gray-500 font-medium">/{planType === 'monthly' ? 'tháng' : 'năm'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    {planType === 'monthly' ? 'Thanh toán linh hoạt, hủy bất kỳ lúc nào.' : 'Tiết kiệm 700k so với trả từng tháng.'}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
               {[
                 "Truy cập toàn bộ khóa học PRO",
                 "Source code dự án thực tế",
                 "Xem video 4K không quảng cáo",
                 "Tham gia cộng đồng Discord VIP"
               ].map((feat, i) => (
                 <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                   <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                   <span>{feat}</span>
                 </div>
               ))}
            </div>

            <Link 
               href={`${paymentBaseUrl}?plan=${planType}`}
               className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group-hover:border-blue-500/30"
            >
               Bắt đầu ngay
            </Link>
          </div>
        </div>

        {/* LIFETIME PLAN (VIP) */}
        <div className="relative group">
           {/* Glow Effect */}
           <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
           
           <div className="relative h-full bg-[#121217] border border-yellow-500/30 rounded-3xl p-8 flex flex-col">
             
             {/* Best Value Badge */}
             <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-black" />
                BEST CHOICE
             </div>

             <div className="mb-6">
                <h3 className="text-xl font-medium text-yellow-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    VIP Lifetime
                </h3>
                <div className="h-9 mb-6"></div> {/* Spacer to align with toggle */}

                <div className="h-20">
                     <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">3.99tr</span>
                        <span className="text-gray-500 font-medium">/trọn đời</span>
                     </div>
                     <p className="text-sm text-yellow-500/80 mt-2 font-medium">Đầu tư 1 lần - Sở hữu mãi mãi</p>
                </div>
             </div>

             <div className="space-y-4 mb-8 flex-1">
                <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10 mb-4">
                    <p className="text-xs text-yellow-200 font-medium leading-relaxed">
                        ✨ Đặc quyền: Mentor hỗ trợ 1:1, Review CV & Portfolio, Tư vấn lộ trình thăng tiến.
                    </p>
                </div>

               {[
                 "Tất cả quyền lợi gói Standard",
                 "Không bao giờ phải gia hạn",
                 "Ưu tiên hỗ trợ 24/7 (Priority)",
                 "Quà tặng: Áo thun & Sticker Dev",
                 "Chứng nhận hoàn thành (Hard Copy)"
               ].map((feat, i) => (
                 <div key={i} className="flex items-start gap-3 text-sm text-gray-200">
                   <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-yellow-400" strokeWidth={3} />
                   </div>
                   <span>{feat}</span>
                 </div>
               ))}
             </div>

             <Link 
               href={`${paymentBaseUrl}?plan=lifetime`}
               className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-center transition-all hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
               <Flame className="w-4 h-4 fill-black" />
               Nâng cấp VIP
            </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
