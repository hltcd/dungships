"use client";

import { useEffect, useState } from "react";

interface AnimatedPriceProps {
  price: number;
  originalPrice?: number | null;
}

export default function AnimatedPrice({ price, originalPrice }: AnimatedPriceProps) {
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    // Count up animation
    let start = 0;
    const end = price;
    const duration = 1500; // 1.5s
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayPrice(Math.floor(start + (end - start) * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [price]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="flex items-end gap-4 mb-8">
        <div className="flex flex-col">
            <span className="text-sm font-bold mb-1 uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse">
                Giá bán ưu đãi
            </span>
             <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight drop-shadow-2xl">
                {formatCurrency(displayPrice)}
            </span>
        </div>
        {originalPrice && (
             <div className="flex flex-col mb-2 pb-1 relative group">
                <span className="text-xl text-gray-600 line-through font-bold decoration-red-500/50 decoration-2">
                    {formatCurrency(originalPrice)}
                </span>
                <span className="absolute -top-6 -right-6 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce shadow-lg shadow-red-500/20">
                    -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                </span>
            </div>
        )}
    </div>
  );
}
