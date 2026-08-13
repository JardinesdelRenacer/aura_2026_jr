import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { readSession, SESSION_COOKIE } from "@/src/lib/auth-session";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const session = await readSession(
            cookieStore.get(SESSION_COOKIE)?.value
        );

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No autorizado",
                },
                { status: 401 }
            );
        }

        await prisma.user.update({
            where: { id: session.userId },
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
