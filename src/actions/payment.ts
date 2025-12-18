"use server";

import { auth } from "@/auth";
import { handleProUpgradeSuccess } from "@/lib/payment-handler";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function verifyPaymentAction(planType: 'monthly' | 'yearly' | 'lifetime') {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Bạn chưa đăng nhập" };
    }

    try {
        // In a real app, we would verify with SePay API here using an Order ID
        // For this demo/dev environment, we simulate success immediately
        
        await handleProUpgradeSuccess(session.user.id, planType);
        
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Payment verification failed:", error);
        return { error: "Lỗi xác thực thanh toán" };
    }
}

export async function checkProStatusAction() {
    const session = await auth();
    if (!session?.user?.id) return false;

    // Fetch fresh user data directly from DB to bypass session cache
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    return user?.role === 'PRO' || user?.role === 'ADMIN';
}
