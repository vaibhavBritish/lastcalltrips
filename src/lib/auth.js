import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyAdminToken(request) {
  try {
    const token = request.cookies.get("token")?.value;
    console.log("authToken",token);

    if (!token) {
      return { error: "No token provided", status: 401 };
    }

    if (!process.env.JWT_SECRET) {
      return { error: "JWT_SECRET not configured", status: 500 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.isAdmin !== true) {
      return { error: "Admin access required", status: 403 };
    }

    return { user: decoded, error: null };
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
}

export function createAuthErrorResponse(error, status) {
  return NextResponse.json({ error }, { status });
}
