
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: Request) {
  const session = await auth();
    
  if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, contentType, folder } = await request.json();
  
  if (!filename || !contentType) {
      return NextResponse.json({ error: "Filename and ContentType required" }, { status: 400 });
  }

  // 1. Strict Validation
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedSourceTypes = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];
  const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const allowedSourceExtensions = ['zip', 'rar', '7z'];

  const fileExtension = filename.split('.').pop()?.toLowerCase();
  
  // Sanitize Filename
  const sanitizedFilename = filename
    .replace(/[^a-zA-Z0-9.-]/g, '-') // Replace special chars with hyphen
    .replace(/-+/g, '-')             // Remove multiple hyphens
    .substring(0, 100);             // Limit length

  let targetFolder = "";
  if (folder === "source") {
      // Validate Source Code
      if (!allowedSourceTypes.includes(contentType) && !allowedSourceExtensions.includes(fileExtension || "")) {
          return NextResponse.json({ error: "Invalid source code file type. Only ZIP/RAR/7Z allowed." }, { status: 400 });
      }
      targetFolder = "sourcecodes";
  } else {
      // Default to images
      if (!allowedImageTypes.includes(contentType) || !allowedImageExtensions.includes(fileExtension || "")) {
          return NextResponse.json({ error: "Invalid image type. Only JPG, PNG, WEBP, GIF allowed." }, { status: 400 });
      }
      targetFolder = "imagesSourcecodes";
  }

  const uniqueFilename = `${targetFolder}/${Date.now()}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: uniqueFilename,
        ContentType: contentType,
  });

  try {
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      
      // For images, we return the public URL (if user set it to public)
      // For source code, we return the key to be stored in DB
      const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`;
      
      return NextResponse.json({ 
          signedUrl, 
          publicUrl, 
          key: uniqueFilename 
      });
  } catch (error) {
      console.error("R2 Error:", error);
      return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
    
  if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
      const { key } = await request.json();

      if (!key) {
           return NextResponse.json({ error: "Key required" }, { status: 400 });
      }

      // If key is a full URL, extract the path part
      // Example: https://pub.r2.dev/imagesSourcecodes/123.jpg -> imagesSourcecodes/123.jpg
      let objectKey = key;
      if (key.startsWith("http")) {
          const url = new URL(key);
          // Remove leading slash
          objectKey = url.pathname.substring(1); 
      }

      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
      });

      await s3.send(command);
      
      return NextResponse.json({ success: true });
  } catch (error) {
      console.error("R2 Delete Error:", error);
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
