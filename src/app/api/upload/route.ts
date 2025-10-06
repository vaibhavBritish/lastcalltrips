import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { file } = await req.json();

    const uploaded = await cloudinary.uploader.upload(file, {
      folder: "blog_images",
    });

    return NextResponse.json({ url: uploaded.secure_url });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json(
      { message: "Upload failed", error },
      { status: 500 }
    );
  }
}
