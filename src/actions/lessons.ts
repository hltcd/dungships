"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createLessonAction(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string || "";
    const content = formData.get("content") as string;
    const videoId = formData.get("videoId") as string || null;
    const videoUrl = formData.get("videoUrl") as string || null;
    const order = parseInt(formData.get("order") as string);
    const isFree = formData.get("isFree") === "on";
    const courseId = formData.get("courseId") as string;
    const courseSlug = formData.get("courseSlug") as string;
    
    // Parse resources JSON
    const resourcesJson = formData.get("resources") as string;
    const resources = resourcesJson ? JSON.parse(resourcesJson) : [];

    if (!courseId || !courseSlug || !title || !slug) {
        return { error: "Thiếu thông tin bắt buộc" };
    }

    try {
        await prisma.lesson.create({
            data: {
                title,
                slug,
                description,
                content,
                videoId,
                videoUrl,
                order,
                isFree,
                resources, // Save JSON array
                courseId,
            },
        });
    } catch (error) {
        console.error("Failed to create lesson:", error);
        return { error: "Tạo bài học thất bại" };
    }

    revalidatePath(`/admin/courses/${courseSlug}`);
    redirect(`/admin/courses/${courseSlug}`);
}

export async function updateLessonAction(formData: FormData) {
    const lessonId = formData.get("lessonId") as string;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string || "";
    const content = formData.get("content") as string;
    const videoId = formData.get("videoId") as string || null;
    const videoUrl = formData.get("videoUrl") as string || null;
    const order = parseInt(formData.get("order") as string);
    const isFree = formData.get("isFree") === "on";
    const courseSlug = formData.get("courseSlug") as string;

    // Parse resources JSON
    const resourcesJson = formData.get("resources") as string;
    const resources = resourcesJson ? JSON.parse(resourcesJson) : [];

    if (!lessonId || !courseSlug || !title || !slug) {
        return { error: "Thiếu thông tin bắt buộc" };
    }

    try {
        await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                title,
                slug,
                description,
                content,
                videoId,
                videoUrl,
                order,
                isFree,
                resources, // Update JSON array
            },
        });
    } catch (error) {
        console.error("Failed to update lesson:", error);
        return { error: "Cập nhật bài học thất bại" };
    }

    revalidatePath(`/admin/courses/${courseSlug}`);
    redirect(`/admin/courses/${courseSlug}`);
}
