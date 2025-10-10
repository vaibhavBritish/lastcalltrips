import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { client } from "@/lib/sanity.client";

// GET blog by ID
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const blog = await client.fetch(
    `*[_type=="post" && _id==$id][0]{
      _id,
      title,
      description,
      body,
      mainImage,
      tags,
      publishedAt,
      "slug": slug.current,
      "authorName": author->name
    }`,
    { id }
  );

  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }
  return NextResponse.json({ blog });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const data = await req.json();

    // If title changes, regenerate slug
    if (data.title) {
      const baseSlug = slugify(data.title, { lower: true, strict: true });
      const existing = await client.fetch(`*[_type=="post" && slug.current==$slug && _id!=$id][0]`, { slug: baseSlug, id });
      data.slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;
    }

    const updated = await client.patch(id)
      .set({
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(Array.isArray(data.body) && { body: data.body }),
        ...(Array.isArray(data.tags) && { tags: data.tags }),
        ...(data.slug && { slug: { _type: 'slug', current: data.slug } }),
      })
      .commit();

    return NextResponse.json({ ...updated, message: "Your Blog Updated Successfully" }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/blog/by-id/[id] error:", error);
    return NextResponse.json({ message: "Blog not found or update failed" }, { status: 400 });
  }
}

// DELETE blog by ID
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await client.delete(id);
    return NextResponse.json({ message: "Blog Deleted Successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }
}
