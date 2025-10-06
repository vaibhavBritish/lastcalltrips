import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function POST(request:NextRequest){
    const {name,email,subject,message} = await request.json();

    const user = await prisma.contact.create({
        data:{
            name,
            email,
            subject,
            message
        }
    })
    return NextResponse.json({message:"Message sent successfully",user},{status:201});
}