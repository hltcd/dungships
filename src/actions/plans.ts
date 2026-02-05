"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PlanType } from "@prisma/client";

export async function getPlans() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      include: {
        bonusProducts: true,
      },
      orderBy: {
        order: "asc",
      },
    });
    return plans;
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}

export async function upsertPlan(data: any) {
  try {
    const { id, bonusProducts, ...rest } = data;
    const bonusProductsData = bonusProducts ? bonusProducts.map((productId: string) => ({ id: productId })) : [];

    if (id) {
      await prisma.pricingPlan.update({
        where: { id },
        data: {
          ...rest,
          bonusProducts: {
            set: bonusProductsData
          }
        },
      });
    } else {
      await prisma.pricingPlan.create({
        data: {
          ...rest,
          bonusProducts: {
            connect: bonusProductsData
          }
        },
      });
    }

    revalidatePath("/admin/plans");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error upserting plan:", error);
    return { success: false, error: "Failed to save plan" };
  }
}

export async function deletePlan(id: string) {
  try {
    await prisma.pricingPlan.delete({
      where: { id },
    });
    revalidatePath("/admin/plans");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting plan:", error);
    return { success: false, error: "Failed to delete plan" };
  }
}
