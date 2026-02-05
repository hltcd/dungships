"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { updateInviteStatus } from "@/actions/github-admin";
import { useRouter } from "next/navigation";

interface InviteStatusButtonProps {
    id: string;
    status: "INVITED" | "FAILED";
}

export default function InviteStatusButton({ id, status }: InviteStatusButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        if (!confirm(`Xác nhận đánh dấu trạng thái: ${status === "INVITED" ? "ĐÃ MỜI" : "THẤT BẠI"}?`)) return;
        
        setIsLoading(true);
        try {
            const result = await updateInviteStatus(id, status);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (err) {
            alert("Đã có lỗi xảy ra.");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "INVITED") {
        return (
            <button 
                onClick={handleClick}
                disabled={isLoading}
                title="Đánh dấu đã mời"
                className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
        );
    }

    return (
        <button 
            onClick={handleClick}
            disabled={isLoading}
            title="Đánh dấu thất bại"
            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
    );
}
