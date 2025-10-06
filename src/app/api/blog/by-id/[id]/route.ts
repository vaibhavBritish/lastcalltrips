import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import slugify from "slugify";

// GET blog by ID
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; 

  const blog = await prisma.blog.findUnique({
    where: { id },
  });

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
    let updateData = { ...data };

    if (data.title) {
      const slugBase = slugify(data.title, { lower: true, strict: true });
      let slug = slugBase;
      let i = 1;

      while (await prisma.blog.findUnique({ where: { slug } })) {
        slug = `${slugBase}-${i++}`;
      }

      updateData.slug = slug;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { ...updatedBlog, message: "Your Blog Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/blog/by-id/[id] error:", error);
    return NextResponse.json(
      { message: "Blog not found or update failed" },
      { status: 400 }
    );
  }
}

// DELETE blog by ID
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    return NextResponse.json(
      { message: "Blog not found" },
      { status: 404 }
    );
  }

  await prisma.blog.delete({
    where: { id },
  });

  return NextResponse.json(
    { message: "Blog Deleted Successfully" },
    { status: 200 }
  );
}
