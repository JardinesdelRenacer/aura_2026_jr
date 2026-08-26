import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const tableta = await prisma.auraTouch.findUnique({
            where: { id },
            select: { id: true, nombre: true },
        });

        if (!tableta) {
            return NextResponse.json(
                { success: false, error: "La tableta ya no existe." },
                { status: 404 }
            );
        }

        await prisma.auraTouch.delete({ where: { id } });

        return NextResponse.json({
            success: true,
            message: `La tableta ${tableta.nombre} fue eliminada.`,
        });
    } catch (error) {
        console.error("Error eliminando Aura Touch:", error);
        return NextResponse.json(
            { success: false, error: "No fue posible eliminar la tableta." },
            { status: 500 }
        );
    }
}
