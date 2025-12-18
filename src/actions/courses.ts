"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteCourseAction(courseId: string) {
  try {
    await prisma.course.delete({
      where: { id: courseId },
    });
    
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Delete course error:", error);
    return { success: false, error: "Failed to delete course" };
  }
}

export async function togglePublishAction(courseId: string, currentStatus: boolean) {
  try {
    await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: !currentStatus },
    });
    
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Toggle publish error:", error);
    return { success: false, error: "Failed to toggle publish status" };
  }
}

export async function updateCourseAction(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const image = formData.get("image") as string;

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        price,
        image: image || null,
      },
    });

    revalidatePath("/admin/courses");
    redirect("/admin/courses");
  } catch (error) {
    console.error("Update course error:", error);
    throw error;
  }
}

export async function createCourseAction(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string) || 0;
    const image = formData.get("image") as string;
    const isPublished = formData.get("isPublished") === "on";

    if (!title || !slug) {
        return { error: "Vui lòng điền đầy đủ thông tin bắt buộc" };
    }

    try {
        await prisma.course.create({
            data: {
                title,
                slug,
                description,
                price,
                image: image || "/placeholder-course.jpg",
                isPublished,
            },
        });
    } catch (error) {
        console.error("Failed to create course:", error);
        return { error: "Tạo khóa học thất bại. Slug có thể đã tồn tại." };
    }

    revalidatePath("/admin/courses");
    redirect("/admin/courses");
}
