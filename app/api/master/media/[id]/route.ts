import { prisma } from "@/src/lib/prisma";
import { errorMonitor } from "events";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> } ) {
    try {
        const { id } = await params;

        await prisma.media.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ success: false, error: "No se pudo eliminar la multimedia" }, { status: 500 })
    };
}