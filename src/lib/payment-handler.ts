"use server";

import { prisma } from "@/lib/prisma";

/**
 * Hàm này sẽ được gọi khi Payment Gateway (VNPay, Stripe, MOMO) báo thanh toán thành công
 * Hoặc gọi khi Admin kích hoạt thủ công.
 */
export async function handleProUpgradeSuccess(userId: string, planType: 'monthly' | 'yearly' | 'lifetime' = 'monthly', planId?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // 1. Activate PRO for the Buyer
  const now = new Date();
  const buyerExpiry = user.proExpiresAt && user.proExpiresAt > now ? user.proExpiresAt : now;
  const newBuyerExpiry = new Date(buyerExpiry);

  if (planType === 'monthly') {
    newBuyerExpiry.setMonth(newBuyerExpiry.getMonth() + 1);
  } else if (planType === 'yearly') {
    newBuyerExpiry.setFullYear(newBuyerExpiry.getFullYear() + 1);
  } else if (planType === 'lifetime') {
    newBuyerExpiry.setFullYear(newBuyerExpiry.getFullYear() + 100); // 100 years = Lifetime
  }

  await prisma.user.update({
    where: { id: userId },
    data: { 
      role: "PRO", 
      proExpiresAt: newBuyerExpiry 
    }
  });

  // 1.1 Record Plan Purchase for Bonus Access
  if (planId) {
    await prisma.purchase.upsert({
      where: {
        userId_planId: {
          userId,
          planId
        }
      },
      update: {}, // Already exists, just make sure relation is there
      create: {
        userId,
        planId
      }
    });
  }

  // 2. Check Referral Reward
  if (user.referredBy) {
    const referrer = await prisma.user.findUnique({ where: { id: user.referredBy } });
    
    if (referrer) {
      // Grant 7 days FREE to Referrer
      const referrerNow = new Date();
      const referrerCurrentExpiry = referrer.proExpiresAt && referrer.proExpiresAt > referrerNow 
        ? referrer.proExpiresAt 
        : referrerNow;
        
      const newReferrerExpiry = new Date(referrerCurrentExpiry);
      newReferrerExpiry.setDate(newReferrerExpiry.getDate() + 7);

      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          role: "PRO", // Ensure they have PRO access
          proExpiresAt: newReferrerExpiry
        }
      });
      
      console.log(`[Referral Reward] Granted 7 days to referrer ${referrer.id}`);
    }
  }

  return { success: true };
}
