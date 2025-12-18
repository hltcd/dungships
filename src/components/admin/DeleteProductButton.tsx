"use client";

import { deleteProduct } from "@/actions/products";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id, title }: { id: string, title: string }) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        setIsDeleting(true);
        await deleteProduct(id);
        setIsDeleting(false);
        setIsConfirming(false);
    }

    if (isConfirming) {
        return (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 rounded-lg p-1 absolute right-0 z-10 top-0">
                <button 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                >
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                </button>
                <button 
                  onClick={() => setIsConfirming(false)} 
                  className="bg-gray-700 text-white px-2 py-1 text-xs rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button 
                onClick={() => setIsConfirming(true)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete Product"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
