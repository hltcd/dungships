import { auth } from "@/auth";
import PaymentClient from "@/components/PaymentClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaymentPage(props: PageProps) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const isExtend = searchParams.extend === '1';

  if (!session?.user?.id || !session?.user?.email) {
      redirect('/login?callbackUrl=/pro/payment');
  }

  // Check if user is already PRO
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
  });

  if ((user?.role === 'PRO' || user?.role === 'ADMIN') && !isExtend) {
      redirect('/pro');
  }

  const planParam = searchParams.plan;

  // Plan Configuration
  let plan = "monthly";
  if (planParam === "yearly") plan = "yearly";
  if (planParam === "lifetime") plan = "lifetime";
  
  const config: Record<string, { price: number; code: string; name: string }> = {
    monthly: {
        price: 199000,
        code: "1M",
        name: "Gói 1 Tháng"
    },
    yearly: {
        price: 1690000,
        code: "1Y",
        name: "Gói 1 Năm"
    },
    lifetime: {
        price: 3990000,
        code: "LIFE",
        name: "Gói Trọn Đời (VIP)"
    }
  };

  const selectedPlan = config[plan];
  
  const ACCOUNT_NO = "0366468863";
  const BANK = "MBBank";
  const ACCOUNT_NAME = "LE VIET DUNG";
  
  // Format: PRO + CODE + UserID(6) -> PRO1M123456
  const userIdSuffix = session.user.id.slice(-6).toUpperCase();
  const DESCRIPTION = `PRO${selectedPlan.code}${userIdSuffix}`; 
  
  const qrUrl = `https://img.vietqr.io/image/${BANK}-${ACCOUNT_NO}-compact.png?amount=${selectedPlan.price}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
            <PaymentClient
                price={selectedPlan.price}
                accountNo={ACCOUNT_NO}
                bank={BANK}
                description={DESCRIPTION}
                qrUrl={qrUrl}
                planType={plan as 'monthly' | 'yearly' | 'lifetime'}
            />
        </div>
        
        {/* Plan Info Pill - Static position to avoid overlap */}
        <div className="py-4 text-center pointer-events-none relative z-20 -mt-20 mb-12">
            <span className="bg-[#1f1f2e] text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700 inline-block shadow-lg">
                Đang thanh toán cho: <span className="text-white font-bold">{selectedPlan.name}</span>
            </span>
        </div>

        <Footer />
    </div>
  );
}
