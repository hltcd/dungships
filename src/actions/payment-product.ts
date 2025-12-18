"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyProductPaymentAction(productId: string) {
    const session = await auth();
    
    if (!session?.user?.id) {
        return { error: "Bạn chưa đăng nhập" };
    }

    try {
        // Create Purchase record
        await prisma.purchase.create({
            data: {
                userId: session.user.id,
                productId: productId
            }
        });

        // Revalidate the product page to update access status
        revalidatePath(`/source-code/[slug]`); 
        revalidatePath(`/source-code`);
        
        return { success: true };
    } catch (error) {
        console.error("Product payment verification failed:", error);
        // Check for unique constraint violation (already purchased)
        // @ts-ignore
        if (error.code === 'P2002') {
             return { success: true }; // Treat as success if already owned
        }
        return { error: "Lỗi xác thực thanh toán. Vui lòng liên hệ Admin." };
    }
}

export async function checkPurchaseStatusAction(productId: string) {
    const session = await auth();
    if (!session?.user?.id) return false;

    const purchase = await prisma.purchase.findUnique({
        where: {
            userId_productId: {
                userId: session.user.id,
                productId: productId
            }
        }
    });

    return !!purchase;
}
