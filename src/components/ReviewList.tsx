"use client";

import { Star } from 'lucide-react';
import { Review } from '@/lib/products';
import { useState } from 'react';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    const [filterHigh, setFilterHigh] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    if (!reviews || reviews.length === 0) {
        return (
            <div className="mt-12 bg-[#1f1f2e] border border-gray-800 rounded-3xl p-8 text-center">
                <p className="text-gray-400">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
        );
    }

    // Filter
    const filteredReviews = filterHigh 
        ? reviews.filter(r => r.rating >= 4)
        : reviews;

    // Pagination
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const displayedReviews = filteredReviews.slice(
        (page - 1) * itemsPerPage, 
        page * itemsPerPage
    );

    return (
        <div className="mt-20">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    Đánh giá của học viên 
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">{reviews.length}</span>
                </h3>
                
                <div className="flex bg-[#1f1f2e] p-1 rounded-lg border border-gray-700">
                    <button
                        onClick={() => { setFilterHigh(true); setPage(1); }}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            filterHigh ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        4-5 Sao
                    </button>
                    <button
                        onClick={() => { setFilterHigh(false); setPage(1); }}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            !filterHigh ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Tất cả
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {displayedReviews.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Không có đánh giá nào phù hợp.
                    </div>
                )}
                
                {displayedReviews.map((review) => (
                    <div key={review.id} className="bg-[#1f1f2e] border border-gray-800 p-6 rounded-2xl flex gap-4 md:gap-6 hover:border-gray-700 transition-colors shadow-sm">
                        <img 
                            src={review.avatar} 
                            alt={review.user} 
                            className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/default-avatar.png";
                            }}
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white">{review.user}</h4>
                                <span className="text-gray-500 text-xs">{review.date}</span>
                            </div>
                            <div className="flex text-yellow-500 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-700 fill-gray-700'}`} 
                                    />
                                ))}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {review.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-10 h-10 rounded-lg border font-medium transition-all text-sm ${
                                page === i + 1 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'bg-[#1f1f2e] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
