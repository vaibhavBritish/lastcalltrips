import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET() {
  try {
    const subscribedUsers = await prisma.subscription.findMany({
      select: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        plan: true,
        status: true,
        userId: true,
        createdAt: true, 
      },
    });

    return NextResponse.json({ subscribedUsers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch subscribed users" }, { status: 500 });
  }
}
