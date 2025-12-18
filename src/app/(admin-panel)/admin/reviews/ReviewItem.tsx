'use client';

import { Star, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteReviewAction } from "@/actions/reviews";

interface ReviewItemProps {
    review: {
        id: string;
        user: string;
        avatar: string;
        rating: number;
        date: string;
        content: string;
        product: {
            title: string;
            slug: string;
        };
    }
}

export function ReviewItem({ review }: ReviewItemProps) {
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (confirm("Bạn có chắc chắn muốn xóa review này không? Hành động này không thể hoàn tác.")) {
            setIsDeleting(true);
            startTransition(async () => {
                const result = await deleteReviewAction(review.id);
                if (result.error) {
                    alert(result.error);
                    setIsDeleting(false);
                }
            });
        }
    };

    if (isDeleting && !isPending) {
        // Optimistic UI or just hiding on success (though revalidatePath should handle it, 
        // sometimes client state persists if not unmounted. 
        // Actually revalidatePath will refresh the parent server component, removing this item.)
        // But if error occurred, we set isDeleting false.
    }

    return (
        <div className={`bg-[#1f1f2e] rounded-2xl border border-gray-800 p-6 transition-all ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img 
                  src={review.avatar} 
                  alt={review.user} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-bold">{review.user}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">{review.date}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    on <a href={`/source-code/${review.product.slug}`} target="_blank" className="text-blue-400 hover:underline">{review.product.title}</a>
                  </p>
                  <p className="text-gray-300 mt-3">{review.content}</p>
                </div>
              </div>
              <button 
                onClick={handleDelete}
                disabled={isPending || isDeleting}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 bg-white/5 hover:bg-white/10 rounded-lg"
                title="Xóa review này"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin text-red-400" /> : <Trash2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
    );
}
