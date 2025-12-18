"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

// Generate unique referral code
async function generateReferralCode(name: string): Promise<string> {
  const base = name.replace(/\s+/g, "").toUpperCase().slice(0, 4);
  const random = nanoid(4).toUpperCase();
  const code = `${base}${random}`;
  
  // Check collision
  const exists = await prisma.user.findUnique({ where: { referralCode: code } });
  if (exists) return generateReferralCode(name);
  return code;
}

export async function createReferralCodeAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");
  if (user.referralCode) return { success: true, code: user.referralCode };

  const newCode = await generateReferralCode(user.name || "USER");

  await prisma.user.update({
    where: { id: user.id },
    data: { referralCode: newCode }
  });

  revalidatePath("/settings/referral");
  return { success: true, code: newCode };
}

export async function redeemReferralAction(itemPrice: number = 0, friendCode: string) {
    // Note: The prompt implies "Introduce friend to register -> get free week".
    // Usually this happens when the FRIEND registers enter the code.
    // Or when the FRIEND buys a package. 
    // For simplicity, let's implement: User Enters Friend's Code -> Friend gets 7 days PRO.
    // User cannot enter code if already referred.
    
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { success: false, error: "User not found" };

    if (user.referredBy) {
        return { success: false, error: "Bạn đã nhập mã giới thiệu rồi!" };
    }

    if (user.referralCode === friendCode) {
        return { success: false, error: "Không thể tự giới thiệu bản thân!" };
    }

    const referrer = await prisma.user.findUnique({ where: { referralCode: friendCode } });
    if (!referrer) {
        return { success: false, error: "Mã giới thiệu không hợp lệ!" };
    }

    // Update User to link with Referrer
    await prisma.user.update({
        where: { id: user.id },
        data: { referredBy: referrer.id }
    });

    // NOTE: Reward will be granted when this user purchases PRO package
    // See: payment-logic.ts

    revalidatePath("/settings/referral");
    return { success: true, message: "Đã kết nối mã giới thiệu! Người giới thiệu sẽ nhận quà khi bạn nâng cấp PRO." };
}
