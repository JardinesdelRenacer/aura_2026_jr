import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.sede.deleteMany({ where: { adminId: id, }, });

        await prisma.user.delete({ where: { id }, });
    
        return NextResponse.json({
            success: true,
            message: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error("ERROR AL ELIMINAR USUARIO:", error);
        return NextResponse.json(
            {   
                success: false,
                error: "Error al eliminar usuario: " + String(error),
            },
            { status: 500 }
        );
    }
}