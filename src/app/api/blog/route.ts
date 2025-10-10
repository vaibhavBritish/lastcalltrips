import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { client } from "@/lib/sanity.client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const offset = (page - 1) * limit;

    const query = `*[_type=="post"] | order(publishedAt desc)[$offset...$end]{
      _id,
      title,
      description,
      "slug": slug.current,
      mainImage,
      tags,
      "authorName": author->name,
      publishedAt
    }`;

    const [blogs, total] = await Promise.all([
      client.fetch(query, { offset, end: offset + limit }),
      client.fetch('count(*[_type=="post"])')
    ]);

    return NextResponse.json({ blogs, total });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return NextResponse.json({ message: "Failed to fetch blogs" }, { status: 500 });
  }
}





export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const content = formData.get("content")?.toString();
    const tags = formData.get("tags")?.toString();
    const isPublished = formData.get("isPublished") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!title || !description || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload image to Sanity
    let imageAsset = null;
    if (imageFile) {
      const uploaded = await client.assets.upload("image", imageFile, {
        filename: imageFile.name,
      });
      imageAsset = {
        _type: "image",
        asset: { _type: "reference", _ref: uploaded._id },
      };
    }

    // Convert content to Portable Text blocks
    const blocks = content
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => ({
        _type: "block",
        _key: crypto.randomUUID(),
        style: "normal",
        children: [{ _type: "span", text: line, _key: crypto.randomUUID() }],
      }));

    // Generate slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    const existing = await client.fetch(
      `*[_type=="post" && slug.current==$slug][0]`,
      { slug: baseSlug }
    );
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Create blog in Sanity
    const newPost = await client.create({
      _type: "post",
      title,
      description,
      body: blocks,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      slug: { _type: "slug", current: slug },
      mainImage: imageAsset,
      publishedAt: isPublished ? new Date().toISOString() : null,
      // Optionally set author reference here if you maintain authors in Sanity
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      { message: "Failed to create blog" },
      { status: 500 }
    );
  }
}
