"use client";

import { upsertPlan } from "@/actions/plans";
import { getProducts } from "@/actions/products";
import { PricingPlan, PlanType, Product } from "@prisma/client";
import { Save, Loader2, ArrowLeft, Check, Star, Package } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PlanFormProps {
  plan?: PricingPlan & { bonusProducts: Product[] };
}

export default function PlanForm({ plan }: PlanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<PlanType>(plan?.type || "SUBSCRIPTION");
  const [features, setFeatures] = useState<string>(plan?.features.join("\n") || "");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    plan?.bonusProducts?.map((p) => p.id) || []
  );
  
  const router = useRouter();

  useEffect(() => {
    async function loadProducts() {
      const products = await getProducts();
      setAllProducts(products);
    }
    loadProducts();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    const data = {
      id: plan?.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: type,
      priceMonthly: type === "SUBSCRIPTION" ? parseInt(formData.get("priceMonthly") as string) || null : null,
      priceYearly: type === "SUBSCRIPTION" ? parseInt(formData.get("priceYearly") as string) || null : null,
      priceLifetime: type === "LIFETIME" ? parseInt(formData.get("priceLifetime") as string) || null : null,
      features: features.split("\n").filter(f => f.trim() !== ""),
      specialFeature: formData.get("specialFeature") as string,
      isBestChoice: formData.get("isBestChoice") === "on",
      order: parseInt(formData.get("order") as string) || 0,
      bonusProducts: selectedProductIds,
    };

    const result = await upsertPlan(data);
    
    if (result.success) {
      router.push("/admin/plans");
      router.refresh();
    } else {
      setError(result.error || "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
          <Link href="/admin/plans" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
             <ArrowLeft className="w-4 h-4" /> Back to Plans
          </Link>
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {plan ? "Update Plan" : "Create Plan"}
          </button>
      </div>

      {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
              {error}
          </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Plan Name</label>
                <input 
                    name="name" 
                    defaultValue={plan?.name}
                    placeholder="e.g. Standard Access"
                    required
                    className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                    name="description" 
                    defaultValue={plan?.description || ""}
                    placeholder="Brief description..."
                    rows={2}
                    className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Special Feature / Privilege (Optional)</label>
                <input 
                    name="specialFeature" 
                    defaultValue={plan?.specialFeature || ""}
                    placeholder="e.g. Mentor hỗ trợ 1:1, Review CV..."
                    className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Features (One per line)</label>
                <textarea 
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="Truy cập toàn bộ khóa học PRO&#10;Source code dự án thực tế"
                    rows={6}
                    className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Sản phẩm tặng kèm (Bonus Source Code)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-[#111118] border border-gray-800 rounded-xl">
                  {allProducts.map((product) => (
                    <label 
                      key={product.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedProductIds.includes(product.id)
                        ? "bg-blue-600/10 border-blue-500/50 text-white"
                        : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <input 
                        type="checkbox"
                        className="hidden"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds([...selectedProductIds, product.id]);
                          } else {
                            setSelectedProductIds(selectedProductIds.filter(id => id !== product.id));
                          }
                        }}
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                         selectedProductIds.includes(product.id) ? "bg-blue-500 border-blue-500" : "border-gray-600"
                      }`}>
                        {selectedProductIds.includes(product.id) && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                      </div>
                      <span className="text-xs font-medium truncate">{product.title}</span>
                    </label>
                  ))}
                  {allProducts.length === 0 && (
                    <p className="col-span-2 text-center py-4 text-xs text-gray-500">Chưa có sản phẩm nào.</p>
                  )}
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Plan Settings */}
          <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Plan Settings</h2>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Plan Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("SUBSCRIPTION")}
                    className={`py-2 px-4 rounded-lg border transition-all ${type === "SUBSCRIPTION" ? "bg-blue-600 border-blue-500 text-white" : "bg-[#111118] border-gray-700 text-gray-400 hover:border-gray-500"}`}
                  >
                    Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("LIFETIME")}
                    className={`py-2 px-4 rounded-lg border transition-all ${type === "LIFETIME" ? "bg-blue-600 border-blue-500 text-white" : "bg-[#111118] border-gray-700 text-gray-400 hover:border-gray-500"}`}
                  >
                    Lifetime
                  </button>
                </div>
            </div>

            {type === "SUBSCRIPTION" ? (
              <>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Monthly Price (k VND)</label>
                    <input 
                        name="priceMonthly" 
                        type="number"
                        defaultValue={plan?.priceMonthly || ""}
                        placeholder="e.g. 199"
                        required
                        className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Yearly Price (tr/k VND)</label>
                    <input 
                        name="priceYearly" 
                        type="text"
                        defaultValue={plan?.priceYearly || ""}
                        placeholder="e.g. 1690"
                        className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <p className="text-[10px] text-gray-500">Ex: 1690 for 1.69tr</p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Lifetime Price (tr/k VND)</label>
                  <input 
                      name="priceLifetime" 
                      type="text"
                      defaultValue={plan?.priceLifetime || ""}
                      placeholder="e.g. 3990"
                      required
                      className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-[10px] text-gray-500">Ex: 3990 for 3.99tr</p>
              </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Display Order</label>
                <input 
                    name="order" 
                    type="number"
                    defaultValue={plan?.order || 0}
                    className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#111118] rounded-xl border border-gray-800">
                <input 
                  id="isBestChoice"
                  name="isBestChoice"
                  type="checkbox"
                  defaultChecked={plan?.isBestChoice}
                  className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isBestChoice" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  Best Choice Badge
                </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
