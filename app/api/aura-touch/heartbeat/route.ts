import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const token = request.cookies.get("aura_touch_token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, error: "Tableta no registrada." },
            { status: 401 }
        );
    }

    const tableta = await prisma.auraTouch.findUnique({
        where: { token },
        select: { id: true, activo: true },
    });

    if (!tableta || !tableta.activo) {
        return NextResponse.json(
            { success: false, error: "Tableta no disponible." },
            { status: 403 }
        );
    }

    await prisma.auraTouch.update({
        where: { id: tableta.id },
        data: { lastSeen: new Date() },
    });

    return NextResponse.json({ success: true });
}
