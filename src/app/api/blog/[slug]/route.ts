import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity.client";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const blog = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      description,
      body,
      mainImage,
      tags,
      publishedAt,
      "authorName": author->name,
      "slug": slug.current
    }`,
    { slug }
  );

  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ blog });
}
