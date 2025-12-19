'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createReview(productId: string, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
             return { error: "Vui lòng đăng nhập để đánh giá" };
        }

        const content = formData.get("content") as string;
        const rating = parseInt(formData.get("rating") as string);

        if (!content || content.length < 10) {
            return { error: "Nội dung đánh giá phải có ít nhất 10 ký tự" };
        }

        if (!rating || rating < 1 || rating > 5) {
            return { error: "Vui lòng chọn số sao đánh giá" };
        }

        // 1. Get user info and ID
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
             select: { id: true, name: true, image: true }
        });

        if (!user) return { error: "Người dùng không tồn tại" };

        // 2. Check if user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId
                }
            }
        });

        if (existingReview) {
            return { error: "Bạn đã đánh giá sản phẩm này rồi" };
        }

        // 3. Create Review with live connection
        try {
            await prisma.review.create({
                data: {
                    content,
                    rating,
                    productId,
                    userId: user.id, // Direct link
                    user: user.name || "Người dùng ẩn danh", // Legacy fallback
                    avatar: user.image || "/default-avatar.png", // Legacy fallback
                    date: new Date().toISOString().split('T')[0]
                }
            });
        } catch (e: any) {
            if (e.code === 'P2002') {
                return { error: "Bạn đã đánh giá sản phẩm này rồi" };
            }
            throw e;
        }

        // 3. Revalidate
        const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
        if (product) revalidatePath(`/source-code/${product.slug}`);

        revalidatePath(`/source-code/${productId}`); // Revalidate product page? Need slug.
        // Actually ID might not be slug. But review page is /source-code/[slug].
        // If revalidatePath fails, it's fine.
        revalidatePath('/admin/reviews');
        
        return { success: true };
    } catch (error) {
        console.error("Create review error:", error);
        return { error: "Có lỗi xảy ra khi gửi đánh giá" };
    }
}

export async function deleteReviewAction(reviewId: string) {
    try {
        const session = await auth();
        
        if (session?.user?.role !== 'ADMIN') {
            return { error: "Bạn không có quyền xóa review này" };
        }

        if (!reviewId) {
            return { error: "ID đánh giá không hợp lệ" };
        }

        await prisma.review.delete({
            where: { id: reviewId }
        });

        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        console.error("Delete review error:", error);
        return { error: "Có lỗi xảy ra khi xóa review" };
    }
}
