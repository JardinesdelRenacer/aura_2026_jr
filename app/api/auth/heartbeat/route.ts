import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "userId requerido",
                },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: { id: body.userId },
            data: { lastSeen: new Date() },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false }, { status: 500 }
        );
    }
}