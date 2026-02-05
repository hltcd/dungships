"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateInviteStatus(id: string, status: "INVITED" | "FAILED" | "PENDING") {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        return { error: "Bạn không có quyền thực hiện hành động này." };
    }

    try {
        await prisma.githubInviteRequest.update({
            where: { id },
            data: { status }
        });

        revalidatePath("/admin/github-invites");
        return { success: true };
    } catch (error) {
        console.error("Update Invite Status Error:", error);
        return { error: "Lỗi hệ thống khi cập nhật trạng thái." };
    }
}
