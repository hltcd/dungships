"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Get Products Error:", error);
    return [];
  }
}

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  originalPrice: z.coerce.number().optional(),
  image: z.string().url("Invalid image URL"),
  link: z.string().optional().or(z.literal("")), // Allow R2 keys (paths) which are not URLs
  githubRepo: z.string().optional(), // format: owner/repo
  tags: z.string().optional(), // Will split by comma
  features: z.string().optional(), // Will split by newline
  gallery: z.string().optional(), // Will split by newline
});

export async function createProduct(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  // Parse tags, features, gallery
  const tags = (rawData.tags as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const features = (rawData.features as string)?.split('\n').map(s => s.trim()).filter(Boolean) || [];
  const gallery = (rawData.gallery as string)?.split('\n').map(s => s.trim()).filter(Boolean) || [];

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
      return { error: validated.error.flatten().fieldErrors };
  }

  const { title, slug, description, longDescription, price, originalPrice, image, link } = validated.data;

  try {
    await prisma.product.create({
      data: {
        title,
        slug,
        description,
        longDescription: longDescription || null,
        price,
        originalPrice: originalPrice || null,
        image,
        link: link || null,
        githubRepo: validated.data.githubRepo || null,
        tags,
        features,
        gallery
      }
    });
  } catch (error) {
      console.error("Create Product Error:", error);
      return { error: "Failed to create product. Slug might be duplicate." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
  
    // Parse tags, features, gallery
    const tags = (rawData.tags as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const features = (rawData.features as string)?.split('\n').map(s => s.trim()).filter(Boolean) || [];
    const gallery = (rawData.gallery as string)?.split('\n').map(s => s.trim()).filter(Boolean) || [];
  
    const validated = productSchema.safeParse(rawData);
  
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }
  
    const { title, slug, description, longDescription, price, originalPrice, image, link } = validated.data;
  
    try {
      await prisma.product.update({
        where: { id },
        data: {
          title,
          slug,
          description,
          longDescription: longDescription || null,
          price,
          originalPrice: originalPrice || null,
          image,
          link: link || null,
          githubRepo: validated.data.githubRepo || null,
          tags,
          features,
          gallery
        }
      });
    } catch (error) {
        console.error("Update Product Error:", error);
        return { error: "Failed to update product." };
    }
  
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    redirect("/admin/products");
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id }
        });
        revalidatePath("/admin/products");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete product." };
    }
}
