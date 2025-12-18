"use client";

import { toggleLessonCompleteAction } from "@/actions/progress";
import { CheckCircle, Circle } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface LessonCompleteButtonProps {
    lessonId: string;
    courseSlug: string;
    isCompleted: boolean;
}

export default function LessonCompleteButton({ lessonId, courseSlug, isCompleted: initialIsCompleted }: LessonCompleteButtonProps) {
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        // Optimistic update
        setIsCompleted(!isCompleted);

        startTransition(async () => {
            const res = await toggleLessonCompleteAction(lessonId, courseSlug);
            if (res.error) {
                // Revert if error
                setIsCompleted(!isCompleted);
                alert(res.error);
            } else {
                router.refresh();
            }
        });
    };

    return (
        <button 
            onClick={handleToggle}
            disabled={isPending}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all
                ${isCompleted 
                    ? "bg-green-500 hover:bg-green-600 text-black" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            {isCompleted ? (
                <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="hidden md:inline">Đã hoàn thành</span>
                </>
            ) : (
                <>
                    <Circle className="w-5 h-5" />
                    <span className="hidden md:inline">Đánh dấu hoàn thành</span>
                </>
            )}
        </button>
    );
}
