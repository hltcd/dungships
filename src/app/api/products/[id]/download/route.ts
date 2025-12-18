
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // 1. Fetch Product
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product || !product.link) {
        return NextResponse.json({ error: "Product or file not found" }, { status: 404 });
    }

    // 2. Access Control
    const isAdmin = session.user.role === "ADMIN";
    
    // Check purchase
    const purchase = await prisma.purchase.findUnique({
        where: {
            userId_productId: {
                userId: session.user.id,
                productId: id
            }
        }
    });

    if (!isAdmin && !purchase) {
        return NextResponse.json({ error: "Forbidden: You must purchase this product first." }, { status: 403 });
    }

    // 3. Generate Signed URL
    try {
        // Assuming product.link stores the R2 Key (e.g., "sourcecodes/file.zip")
        // If it stores a full URL, we strip the domain if possible, or just use it if it matches our expected format
        let key = product.link;
        if (key.startsWith("http")) {
             // Fallback: extract key from URL if it's our public URL
             try {
                const url = new URL(key);
                key = url.pathname.substring(1);
             } catch (e) {
                // Keep as is if not a valid URL
             }
        }

        // SECURITY: Force path to stay inside sourcecodes folder
        if (!key.startsWith("sourcecodes/")) {
            console.error(`Blocked suspicious download attempt for key: ${key}`);
            return NextResponse.json({ error: "Secure path violation" }, { status: 403 });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        });

        // URL valid for 5 minutes
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        return NextResponse.redirect(signedUrl);

    } catch (error) {
        console.error("Download Error:", error);
        return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 });
    }
}
