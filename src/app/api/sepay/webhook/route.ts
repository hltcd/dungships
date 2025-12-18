
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleProUpgradeSuccess } from "@/lib/payment-handler";

const SEPAY_API_KEY = process.env.SEPAY_API_KEY || "SEPAY_API_KEY_DEMO"; // Default for dev

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || authHeader !== `Apikey ${SEPAY_API_KEY}`) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Payload
    const body = await req.json();
    const { content, transferAmount } = body;

    // --- CASE 1: PRO UPGRADE ---
    // Pattern: PRO + CODE(1M/1Y/LIFE) + UserIdSuffix(6)
    const proRegex = /PRO(1M|1Y|LIFE)([A-Z0-9]{6})/i;
    const proMatch = content?.match(proRegex);

    if (proMatch) {
        const planCode = proMatch[1].toUpperCase(); // 1M, 1Y, LIFE
        const userIdSuffix = proMatch[2];

        let planType: 'monthly' | 'yearly' | 'lifetime' = 'monthly';
        if (planCode === '1Y') planType = 'yearly';
        if (planCode === 'LIFE') planType = 'lifetime';

        const user = await prisma.user.findFirst({
            where: {
                id: {
                    endsWith: userIdSuffix, 
                    mode: 'insensitive'
                }
            }
        });

        if (!user) {
             return NextResponse.json({ success: false, message: "User not found for PRO upgrade" }, { status: 404 });
        }

        console.log(`[SePay] Processing PRO upgrade for user ${user.email} (${user.id}) - Plan: ${planType}`);
        await handleProUpgradeSuccess(user.id, planType);
        return NextResponse.json({ success: true, message: "Upgrade successful" });
    }

    // --- CASE 2: PRODUCT PURCHASE ---
    // Pattern: SLUG_PREFIX(10 chars) + SPACE + UserIdSuffix(6)
    // Example: "SAAS-BOILE ABCDEF"
    const productRegex = /^([A-Z0-9-]{1,15})\s+([A-Z0-9]{6})$/i;
    const productMatch = content?.match(productRegex);

    if (productMatch) {
        const slugPrefix = productMatch[1].toLowerCase(); // Slugs are usually lowercase
        const userIdSuffix = productMatch[2];

        // 1. Find User
        const user = await prisma.user.findFirst({
            where: {
                id: { endsWith: userIdSuffix, mode: 'insensitive' }
            }
        });

        if (!user) {
             return NextResponse.json({ success: false, message: "User not found for Product purchase" }, { status: 404 });
        }

        // 2. Find Product
        // We have to fuzzy match the slug since we only have the first 10-15 chars
        const product = await prisma.product.findFirst({
             where: {
                 slug: { startsWith: slugPrefix, mode: 'insensitive' }
             }
        });
        
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // 3. Create Purchase
        console.log(`[SePay] Processing Product purchase: ${product.slug} for user ${user.email}`);
        
        try {
            await prisma.purchase.create({
                data: {
                    userId: user.id,
                    productId: product.id
                }
            });
        } catch (e: any) {
            if (e.code !== 'P2002') throw e; // Ignore duplicates
        }

        return NextResponse.json({ success: true, message: "Purchase successful" });
    }

    console.log("[SePay] Ignored transaction, no matching pattern:", content);
    return NextResponse.json({ success: true, message: "Ignored" });

  } catch (error) {
    console.error("[SePay] Webhook Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
