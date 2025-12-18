import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReferralClient from "@/components/ReferralPageClient";

export default async function ReferralPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
        _count: {
            select: { referrals: true }
        }
    }
  });

  if (!user) redirect("/login");

  return (
    <ReferralClient 
        user={{
            referralCode: user.referralCode,
            referralsCount: user._count.referrals,
            proExpiresAt: user.proExpiresAt,
            referredBy: user.referredBy
        }} 
    />
  );
}
