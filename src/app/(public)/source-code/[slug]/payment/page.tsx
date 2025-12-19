import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PaymentProductClient from "@/components/PaymentProductClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const BANK = "MBBank";
const ACCOUNT_NO = "VQRQACJYV7290";
const ACCOUNT_NAME = "LE VIET DUNG";

export default async function ProductPaymentPage(props: PageProps) {
    const params = await props.params;
    const session = await auth();

    if (!session?.user) {
        redirect(`/login?callbackUrl=/source-code/${params.slug}/payment`);
    }

    const product = await prisma.product.findUnique({
        where: { slug: params.slug }
    });

    if (!product) {
        notFound();
    }

    // Check if already owned
    const existingPurchase = await prisma.purchase.findUnique({
        where: {
            userId_productId: {
                userId: session.user.id!,
                productId: product.id
            }
        }
    });

    if (existingPurchase || session.user.role === 'ADMIN') {
        redirect(`/source-code/${product.slug}`);
    }

    // Payment Info
    const DESCRIPTION = `${product.slug.toUpperCase().slice(0, 15)} ${session.user.id.slice(-6).toUpperCase()}`;
    const qrUrl = `https://qr.sepay.vn/img?acc=${ACCOUNT_NO}&bank=${BANK}&amount=${product.price}&des=${encodeURIComponent(DESCRIPTION)}`;

    return (
        <PaymentProductClient 
            price={product.price}
            productName={product.title}
            productId={product.id}
            productSlug={product.slug}
            accountNo={ACCOUNT_NO}
            bank={BANK}
            description={DESCRIPTION}
            qrUrl={qrUrl}
        />
    );
}
