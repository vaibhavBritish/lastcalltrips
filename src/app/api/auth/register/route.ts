import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    const { email, name, password } = await request.json();

    if (!email || !name || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    // Explanation:
    // (?=.*[A-Z]) -> At least one uppercase letter
    // (?=.*[!@#$%^&*(),.?":{}|<>]) -> At least one special character
    // .{8,} -> Minimum 8 characters

    if (!passwordRegex.test(password)) {
        return NextResponse.json({ 
            message: "Password must be at least 8 characters long, include at least one uppercase letter and one special character." 
        }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nameString = name.charAt(0).toUpperCase() + name.slice(1);

    const user = await prisma.user.create({
        data: { 
            email, 
            name: nameString, 
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    return NextResponse.json({ user }, { status: 201 });
}
