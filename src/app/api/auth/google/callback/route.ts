import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID as string;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL as string) || req.nextUrl.origin;
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!clientId || !clientSecret || !jwtSecret) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return NextResponse.json({ error: "Failed to exchange code", details: t }, { status: 400 });
    }
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token as string;

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profileRes.ok) {
      const t = await profileRes.text();
      return NextResponse.json({ error: "Failed to fetch profile", details: t }, { status: 400 });
    }
    const profile = await profileRes.json();
    const googleId: string = profile.id;
    const email: string = profile.email;
    const name: string = profile.name || profile.given_name || "User";

    let user = await prisma.user.findFirst({ where: { OR: [{ googleId }, { email }] } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          // password left null for Google users
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId } });
    }

    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, jwtSecret, {
      expiresIn: "1h",
    });

    const response = NextResponse.redirect(`${baseUrl}/`);
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });
    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


