"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestGithubInvite(productId: string, githubUsername: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Bạn cần đăng nhập để thực hiện hành động này." };
    }

    try {
        // Validation
        if (!githubUsername || githubUsername.trim().length === 0) {
            return { error: "Vui lòng nhập Username GitHub." };
        }

        // Check if user has access to the product
        let hasAccess = false;
        if (session.user.role === "ADMIN") {
            hasAccess = true;
        } else {
            const purchase = await prisma.purchase.findUnique({
                where: {
                    userId_productId: {
                        userId: session.user.id,
                        productId: productId
                    }
                }
            });
            
            if (purchase) {
                hasAccess = true;
            } else {
                const planPurchases = await prisma.purchase.findMany({
                    where: {
                        userId: session.user.id,
                        planId: { not: null }
                    },
                    include: {
                        plan: {
                            include: {
                                bonusProducts: {
                                    select: { id: true }
                                }
                            }
                        }
                    }
                });

                hasAccess = planPurchases.some(p => 
                    p.plan?.bonusProducts.some(bp => bp.id === productId)
                );
            }
        }

        if (!hasAccess) {
            return { error: "Bạn không có quyền truy cập sản phẩm này." };
        }

        // Save request
        await prisma.githubInviteRequest.upsert({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId
                }
            },
            update: {
                githubUsername: githubUsername.trim(),
                status: "PENDING",
                updatedAt: new Date()
            },
            create: {
                userId: session.user.id,
                productId: productId,
                githubUsername: githubUsername.trim(),
                status: "PENDING"
            }
        });

        revalidatePath(`/source-code/[slug]`, "page");
        return { success: true };
    } catch (error) {
        console.error("Github Invite Request Error:", error);
        return { error: "Lỗi hệ thống khi gửi yêu cầu." };
    }
}
