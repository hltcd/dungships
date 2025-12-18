"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProductVisibility(id: string, isPublished: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isPublished },
    });
    revalidatePath("/admin/products");
    revalidatePath("/source-code"); // Revalidate public list
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle product visibility:", error);
    return { success: false, error: "Failed to update visibility" };
  }
}
