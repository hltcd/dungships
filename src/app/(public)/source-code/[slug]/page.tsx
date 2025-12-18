import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ShoppingCart, Check, Shield, Zap, Star, Download } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';
import AnimatedPrice from '@/components/AnimatedPrice';
import BuyButton from '@/components/BuyButton';
import { prisma } from '@/lib/prisma';
import { Review } from '@/lib/products';
import { auth } from '@/auth';
import { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.title} | Source Code Chất Lượng`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      url: `/source-code/${product.slug}`,
      siteName: 'HocLapTrinhCungDung',
      images: [product.image, ...previousImages],
      type: 'website',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage(props: PageProps) {
  const params = await props.params;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { reviews: true }
  });

  if (!product || (!product.isPublished && !isAdmin)) {
    notFound();
  }

  // Check Access
  let hasAccess = false;
  if (session?.user) {
      if (session.user.role === "ADMIN") {
          hasAccess = true;
      } else {
          const purchase = await prisma.purchase.findUnique({
              where: {
                  userId_productId: {
                      userId: session.user.id,
                      productId: product.id
                  }
              }
          });
          if (purchase) {
              hasAccess = true;
          }
      }
  }

  // Fallback if gallery is empty
  const galleryImages = product.gallery && product.gallery.length > 0 
      ? product.gallery 
      : [product.image];

  // Map Prisma reviews to component props if types mismatch (Prisma Date vs string)
  const reviews = product.reviews.map(r => ({
      ...r,
      date: r.date 
  }));

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb / Back Button */}
      <Link href="/source-code" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
        <div className="p-2 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
        </div>
        <span className="font-bold">Quay lại Source Code</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative">
        {/* Left Column: Gallery & Trust */}
        <div className="space-y-8 lg:sticky lg:top-24 lg:h-fit">
            <ImageGallery images={galleryImages} title={product.title} />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1f1f2e]/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                    <Shield className="w-6 h-6 text-green-500" />
                    <span className="text-xs font-bold text-gray-300">Bảo Mật 100%</span>
                </div>
                <div className="bg-[#1f1f2e]/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <span className="text-xs font-bold text-gray-300">Instant Delivery</span>
                </div>
                <div className="bg-[#1f1f2e]/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                    <Star className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-bold text-gray-300">Hỗ trợ 24/7</span>
                </div>
            </div>
        </div>

        {/* Right Column: Details & Action */}
        <div className="flex flex-col">
            <div className="mb-6">
                 <div className="flex gap-2 mb-4 flex-wrap">
                    {product.tags.map(tag => (
                        <span key={tag} className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                            #{tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-[32px] md:text-[48px] font-black text-white mb-4 leading-tight uppercase tracking-tight">
                    {product.title}
                </h1>
                <p className="text-base text-gray-400 leading-relaxed font-medium">
                    {product.description}
                </p>
            </div>

            <div className="bg-[#1f1f2e] border border-gray-800 rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
                <AnimatedPrice price={product.price} originalPrice={product.originalPrice} />

                {hasAccess ? (
                     <a 
                        href={`/api/products/${product.id}/download`}
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-500/20 transform hover:-translate-y-1 text-lg mb-2"
                     >
                        <Download className="w-6 h-6" />
                        Tải Source Code Ngay
                     </a>
                ) : (
                    <BuyButton 
                        productId={product.id} 
                        isLoggedIn={!!session?.user} 
                        price={product.price}
                    />
                )}
                
                {hasAccess && (
                    <p className="text-center text-green-400 text-xs font-medium">
                        Bạn đã sở hữu sản phẩm này.
                    </p>
                )}
                <p className="text-center text-gray-500 text-xs mt-4">
                    Thanh toán an toàn qua ngân hàng hoặc ví điện tử. Link tải sẽ được gửi qua email.
                </p>
            </div>

            <div className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-bold text-white mb-4">Chi tiết sản phẩm</h3>
                <p className="text-gray-400 text-lg mb-6">
                    {product.longDescription || product.description}
                </p>
                
                {product.features && (
                    <>
                        <h3 className="text-2xl font-bold text-white mb-4">Tính năng nổi bật</h3>
                        <ul className="space-y-3">
                            {product.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-500/10 p-1 rounded-full">
                                        <Check className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span className="text-gray-300 font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            
            {/* Review Form */}
            {hasAccess && !reviews.some(r => r.userId === session?.user?.id) && (
                 <div className="mb-12 mt-16">
                    <ReviewForm productId={product.id} />
                 </div>
            )}

            {/* Reviews Section */}
            <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
