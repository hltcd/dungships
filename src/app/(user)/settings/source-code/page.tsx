import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";

export default async function PurchasedSourceCodePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const purchases = await prisma.purchase.findMany({
    where: { 
      userId: session.user.id,
      productId: { not: null }
    },
    include: {
      product: true
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Source Code Đã Mua</h1>
        <p className="text-gray-400 mt-1">Các dự án mẫu bạn đã sở hữu</p>
      </div>

      <div className="grid gap-6">
        {purchases.length === 0 ? (
          <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Chưa mua Source Code nào</h3>
            <p className="text-gray-400 mb-6">Bạn chưa mua source code nào. Hãy xem qua kho dự án mẫu!</p>
            <Link 
              href="/source-code" 
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Xem Source Code
            </Link>
          </div>
        ) : (
          purchases.map((purchase) => {
            const product = purchase.product!;
            return (
              <div key={product.id} className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-800">
                   <img src={product.image} alt="" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex gap-4">
                    {product.link && product.link.trim() !== "" && (
                      <a 
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                    <a 
                        href={`/api/products/${product.id}/download`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm shadow-lg shadow-blue-500/20"
                    >
                      <Download className="w-4 h-4" />
                      Tải Xuống
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
