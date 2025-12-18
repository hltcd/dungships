import Link from 'next/link';
import { ShoppingCart, Star, Code, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma'; // Use real DB client

export default async function SourceCodePage() {
  // Fetch products from Database
  const products = await prisma.product.findMany({
    where: {
        isPublished: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-16 text-center">
        <h1 className="text-[40px] md:text-[48px] font-black text-white uppercase tracking-tight">
          Source Code
        </h1>
        <p className="text-base text-gray-400 max-w-2xl font-medium">
          Dự án mẫu, giao diện và mã nguồn chuẩn SEO giúp bạn bứt phá dự án nhanh hơn
        </p>
        <div className="w-24 h-1 bg-[#6c7983] rounded-full mt-10 opacity-60"></div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <Link href={`/source-code/${product.slug}`} key={product.id} className="group relative bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:border-blue-500/30">
            {/* Image */}
            <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80"></div>
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 grayscale-[30%] group-hover:grayscale-0"
                />
                 {product.originalPrice && (
                    <div className="absolute top-4 right-4 z-20 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                        -{((1 - product.price / product.originalPrice) * 100).toFixed(0)}%
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1 uppercase tracking-tight">
                    {product.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px] font-medium leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Giá trọn gói</span>
                        <div className="flex items-baseline gap-2">
                             <span className="text-lg font-black text-white italic">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </span>
                            {product.originalPrice && (
                                <span className="text-[10px] text-gray-600 line-through font-bold">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                                </span>
                            )}
                        </div>
                    </div>
                    <button className="bg-blue-600/10 group-hover:bg-blue-600 p-2.5 rounded-full text-blue-400 group-hover:text-white transition-all shadow-inner">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
