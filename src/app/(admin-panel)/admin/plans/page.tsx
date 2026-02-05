import { getPlans, deletePlan } from "@/actions/plans";
import Link from "next/link";
import { Plus, Edit, Trash2, Star, CheckCircle2 } from "lucide-react";
import { PricingPlan } from "@prisma/client";

export default async function AdminPlansPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Pricing Plans</h1>
          <p className="text-gray-400 mt-1">Manage Pro subscription and lifetime packages.</p>
        </div>
        <Link 
          href="/admin/plans/new"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" /> New Plan
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan: PricingPlan) => (
          <div 
            key={plan.id}
            className="bg-[#1f1f2e] border border-gray-800 rounded-2xl overflow-hidden flex flex-col group hover:border-gray-700 transition-all"
          >
            <div className="p-6 flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {plan.name}
                    {plan.isBestChoice && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                  </h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${
                    plan.type === "SUBSCRIPTION" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  }`}>
                    {plan.type}
                  </span>
                </div>
                <div className="text-right">
                  {plan.type === "SUBSCRIPTION" ? (
                    <>
                      <div className="text-lg font-bold text-white">{plan.priceMonthly}k</div>
                      <div className="text-[10px] text-gray-500">/ Thăng</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-white">{(plan.priceLifetime || 0) / 1000}tr</div>
                      <div className="text-[10px] text-gray-500">/ Trọn đời</div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {plan.features.slice(0, 3).map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <p className="text-[10px] text-gray-500">+{plan.features.length - 3} more features</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#111118] border-t border-gray-800 flex items-center justify-between gap-3">
              <Link 
                href={`/admin/plans/${plan.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Edit className="w-4 h-4" /> Edit
              </Link>
              <form action={async () => {
                "use server";
                await deletePlan(plan.id);
              }}>
                <button 
                  type="submit"
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-[#1f1f2e] border border-dashed border-gray-800 rounded-3xl">
             <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto text-gray-600">
               <Plus className="w-8 h-8" />
             </div>
             <div>
               <p className="text-gray-400 font-medium">No pricing plans found</p>
               <Link href="/admin/plans/new" className="text-blue-500 hover:underline text-sm font-medium">Create your first plan</Link>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
