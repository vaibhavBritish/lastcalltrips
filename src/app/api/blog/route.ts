import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import slugify from "slugify";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    const blogs = await prisma.blog.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            slug: true,
            image: true,
            author: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            isPublished: true
        }
    })
    return NextResponse.json({ blogs })
}


export async function POST(req: NextRequest) {
  try {
    const { title, description, content, author, tags, isPublished, image } =
      await req.json();

    if (
      !title ||
      !description ||
      !content ||
      !author ||
      !tags ||
      !image ||
      isPublished === undefined
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    let imageUrls: string[] = [];
    if (Array.isArray(image)) {
      for (const img of image) {
        if (img.startsWith("data:")) {
          const uploaded = await cloudinary.uploader.upload(img, {
            folder: "nextjs_blog_images",
          });
          imageUrls.push(uploaded.secure_url);
        } else {
          imageUrls.push(img); // already URL
        }
      }
    }

    const slugBase = slugify(title, { lower: true, strict: true });
    let slug = slugBase;
    let i = 1;
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${i++}`;
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        description,
        content,
        image: imageUrls,
        slug,
        author,
        tags,
        isPublished,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
