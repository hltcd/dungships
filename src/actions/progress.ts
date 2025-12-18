"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleLessonCompleteAction(lessonId: string, courseSlug: string) {
    const session = await auth();
    
    if (!session?.user?.id) {
        return { error: "Bạn cần đăng nhập để thực hiện tính năng này" };
    }

    const userId = session.user.id;

    try {
        const existingProgress = await prisma.userProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            }
        });

        if (existingProgress) {
            // Toggle
            await prisma.userProgress.update({
                where: { id: existingProgress.id },
                data: { isCompleted: !existingProgress.isCompleted }
            });
        } else {
            // Create
            await prisma.userProgress.create({
                data: {
                    userId,
                    lessonId,
                    isCompleted: true
                }
            });
        }

        revalidatePath(`/courses/${courseSlug}`);
        return { success: true };

    } catch (error) {
        console.error("Error toggling progress:", error);
        return { error: "Có lỗi xảy ra, vui lòng thử lại" };
    }
}
