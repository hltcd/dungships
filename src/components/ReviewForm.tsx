"use client";

import { createReview } from "@/actions/reviews";
import { Star, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("rating", rating.toString());
        formData.append("content", content);

        const result = await createReview(productId, formData);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setContent("");
            setRating(0);
            router.refresh();
        }
        setIsLoading(false);
    }

    if (success) {
        return (
            <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl text-center">
                <h3 className="text-green-400 font-bold mb-2">Đánh giá thành công!</h3>
                <p className="text-gray-400 text-sm">Cảm ơn bạn đã chia sẻ cảm nhận về sản phẩm.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#1f1f2e] border border-gray-800 p-6 md:p-8 rounded-3xl mb-12">
            <h3 className="text-xl font-bold text-white mb-6">Viết đánh giá của bạn</h3>
            
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Bạn chấm mấy sao?</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-colors"
                            >
                                <Star 
                                    className={`w-8 h-8 ${
                                        (hoverRating || rating) >= star 
                                        ? "fill-yellow-400 text-yellow-400" 
                                        : "text-gray-600"
                                    }`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nội dung đánh giá</label>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về source code này... (tối thiểu 10 ký tự)"
                        rows={4}
                        className="w-full bg-[#111118] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isLoading || rating === 0 || content.length < 10}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Gửi Đánh Giá
                    </button>
                </div>
            </div>
        </form>
    );
}
