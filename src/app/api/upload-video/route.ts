import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
    
  if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Bunny.net
    const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
    const API_KEY = process.env.BUNNY_STREAM_API_KEY!;

    // Create video
    const createResponse = await fetch(
      `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || file.name,
        }),
      }
    );

    if (!createResponse.ok) {
      throw new Error("Failed to create video");
    }

    const videoData = await createResponse.json();
    const videoId = videoData.guid;

    // Upload video file
    const fileBuffer = await file.arrayBuffer();
    const uploadResponse = await fetch(
      `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
      {
        method: "PUT",
        headers: {
          AccessKey: API_KEY,
        },
        body: fileBuffer,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload video");
    }

    // Return video info
    return NextResponse.json({
      success: true,
      videoId,
      videoUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`,
      message: "Video uploaded successfully. Processing may take a few minutes.",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
