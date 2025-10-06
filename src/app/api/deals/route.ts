import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function POST(request: Request) {
  try {
    const { title, description, image, price, tags = [], savings } = await request.json();

    if (!title || !description || !image || price === undefined || price === null) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newDeal = await prisma.deal.create({
      data: {
        title,
        description,
        image, // single string
        price: parseFloat(price),
        tags,
        savings: savings ? parseFloat(savings) : undefined,
      },
    });

    return NextResponse.json(newDeal, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(deals, { status: 200 });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}
