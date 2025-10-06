import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";



export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { isAdmin } = await request.json();

    try {
        const { id } = await context.params;
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isAdmin },
        });
        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
