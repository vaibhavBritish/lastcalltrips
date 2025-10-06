// /api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../../prisma/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      email: string;
      isAdmin: boolean;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ["ACTIVE", "TRIALING"] },
        stripeCurrentPeriodEnd: { gte: new Date() },
      },
    });

    const isSubscribed = !!activeSub;

  
    return NextResponse.json({ 
        user: { 
            ...user, 
            isSubscribed 
        } 
    });
  } catch (err) {
    console.error("Auth verification error:", err);
    const response = NextResponse.json({ user: null }, { status: 401 });
    response.cookies.delete("token");
    return response;
  }
}