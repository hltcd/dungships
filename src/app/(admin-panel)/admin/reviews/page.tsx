import { prisma } from "@/lib/prisma";
import { ReviewItem } from "./ReviewItem";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { date: "desc" },
    include: {
      product: { select: { title: true, slug: true } }
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Quản Lý Reviews</h1>
        <p className="text-gray-400 mt-1">{reviews.length} reviews</p>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-4">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review as any} />
        ))}
        {reviews.length === 0 && (
          <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 p-12 text-center text-gray-500">
            Chưa có reviews nào
          </div>
        )}
      </div>
    </div>
  );
}
