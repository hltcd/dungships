"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface BuyButtonProps {
    productId: string;
    isLoggedIn: boolean;
    price: number;
}

export default function BuyButton({ productId, isLoggedIn, price }: BuyButtonProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleBuy = () => {
        if (!isLoggedIn) {
            const callbackUrl = encodeURIComponent(pathname);
            router.push(`/login?callbackUrl=${callbackUrl}`);
            return;
        }

        router.push(`${pathname}/payment`);
    };

    return (
        <button 
            onClick={handleBuy}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-1 text-lg"
        >
            <ShoppingCart className="w-6 h-6" />
            Mua Ngay & Tải Về
        </button>
    );
}
