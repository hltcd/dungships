"use client";

import { useState } from "react";
import Link from "next/link";
import { PricingPlan, Product } from "@prisma/client";
import { Flame, Check, Zap, Globe, Clock, Gift, Package } from "lucide-react";

export default function PricingSection({ session, plans }: { session: any, plans: (PricingPlan & { bonusProducts: Product[] })[] }) {
  const [planType, setPlanType] = useState<"monthly" | "yearly">("monthly");
  
  const paymentBaseUrl = session?.user ? "/pro/payment" : "/login?callbackUrl=/pro/payment";

  return (
    <div className="max-w-6xl mx-auto px-4">
      
      {/* Premium Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        {plans.map((plan: PricingPlan & { bonusProducts: Product[] }) => (
          <div key={plan.id} className="relative group">
            {/* Glow Effect for Best Choice */}
            {plan.isBestChoice && (
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            )}
            {!plan.isBestChoice && (
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            )}
            
            <div className={`relative h-full bg-[#121217] border rounded-3xl p-8 flex flex-col transition-colors ${
              plan.isBestChoice ? "border-yellow-500/30" : "border-white/5 hover:bg-[#16161c]"
            }`}>
              
              {/* Best Value Badge */}
              {plan.isBestChoice && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-black" />
                    BEST CHOICE
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-medium mb-2 flex items-center gap-2 ${plan.isBestChoice ? "text-yellow-400" : "text-blue-400"}`}>
                  <span className={`w-2 h-2 rounded-full ${plan.isBestChoice ? "bg-yellow-400 animate-pulse" : "bg-blue-500"}`}></span>
                  {plan.name}
                </h3>
                
                {plan.type === "SUBSCRIPTION" && (
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
                )}
                {plan.type === "LIFETIME" && <div className="h-9 mb-6"></div>}

                <div className="h-20">
                  <div className="flex items-baseline gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                          {plan.type === "SUBSCRIPTION" 
                            ? (planType === 'monthly' ? `${plan.priceMonthly}k` : `${plan.priceYearly && plan.priceYearly >= 1000 ? (plan.priceYearly/1000).toFixed(2) + 'tr' : plan.priceYearly + 'k'}`)
                            : `${plan.priceLifetime && plan.priceLifetime >= 1000 ? (plan.priceLifetime/1000).toFixed(2) + 'tr' : plan.priceLifetime + 'k'}`
                          }
                      </span>
                      <span className="text-gray-500 font-medium">
                        /{plan.type === "SUBSCRIPTION" ? (planType === 'monthly' ? 'tháng' : 'năm') : 'trọn đời'}
                      </span>
                  </div>
                  <p className={`text-sm mt-2 ${plan.isBestChoice ? "text-yellow-500/80 font-medium" : "text-gray-500"}`}>
                      {plan.type === "SUBSCRIPTION" 
                        ? (planType === 'monthly' ? 'Thanh toán linh hoạt, hủy bất kỳ lúc nào.' : 'Tiết kiệm đáng kể so với trả từng tháng.')
                        : 'Đầu tư 1 lần - Sở hữu mãi mãi'
                      }
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.specialFeature && (
                  <div className={`p-3 rounded-lg border mb-4 ${
                    plan.isBestChoice ? "bg-yellow-500/5 border-yellow-500/10" : "bg-blue-500/5 border-blue-500/10"
                  }`}>
                      <p className={`text-xs font-medium leading-relaxed ${plan.isBestChoice ? "text-yellow-200" : "text-blue-200"}`}>
                          ✨ Đặc quyền: {plan.specialFeature}
                      </p>
                  </div>
                )}

                {plan.features.map((feat: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-200">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.isBestChoice ? "bg-yellow-500/20" : "bg-blue-500/20"
                    }`}>
                        <Check className={`w-3 h-3 ${plan.isBestChoice ? "text-yellow-400" : "text-blue-400"}`} strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}

                {plan.bonusProducts && plan.bonusProducts.length > 0 && (
                  <div className="pt-4 mt-2 border-t border-white/5 space-y-3">
                    <p className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase flex items-center gap-1.5 px-1">
                      <Gift className="w-3 h-3" />
                      Quà tặng kèm (Source Code)
                    </p>
                    {plan.bonusProducts.map((product: Product) => (
                      <a 
                        key={product.id} 
                        href={`/source-code/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-blue-400 group/item hover:text-blue-300 transition-colors"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform group-hover/item:bg-blue-500/20">
                          <Package className="w-3 h-3" />
                        </div>
                        <span className="font-medium">{product.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href={`${paymentBaseUrl}?plan=${plan.type === "LIFETIME" ? "lifetime" : planType}&planId=${plan.id}`}
                className={`w-full py-4 rounded-xl font-bold text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  plan.isBestChoice 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:shadow-lg hover:shadow-orange-500/25" 
                    : "bg-white/5 hover:bg-white/10 border border-white/10 text-white group-hover:border-blue-500/30"
                }`}
              >
                {plan.isBestChoice && <Flame className="w-4 h-4 fill-black" />}
                {plan.isBestChoice ? "Nâng cấp VIP" : "Bắt đầu ngay"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
