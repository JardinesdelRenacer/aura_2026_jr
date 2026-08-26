import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { isRoomEnabled } from "@/src/lib/rooms";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const body = await request.json();

        const existente = await prisma.pantallaCliente.findUnique({
            where: { id },
            select: { sede: { select: { numeroSalas: true, salaVip: true } } },
        });

        if (!existente) {
            return NextResponse.json({ success: false, error: "La pantalla no existe." }, { status: 404 });
        }

        if (body.verticalRoom !== null && body.verticalRoom !== undefined &&
            !isRoomEnabled(body.verticalRoom, existente.sede.numeroSalas, existente.sede.salaVip)) {
            return NextResponse.json(
                { success: false, error: "Sala invalida" }, { status: 400 }
            );
        }

        const pantalla = await prisma.pantallaCliente.update({
            where: { id },

            data: {
                verticalRoom: body.verticalRoom ?? null
            },

            include: {
                presentacion: true
            },
        });

        return NextResponse.json({ success: true, pantalla });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ success: false, error: "No fue posible actualizar la pantalla" }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const pantalla = await prisma.pantallaCliente.findUnique({
            where: { id },
            select: { id: true, nombre: true },
        });

        if (!pantalla) {
            return NextResponse.json(
                { success: false, error: "La pantalla ya no existe." },
                { status: 404 }
            );
        }

        await prisma.pantallaCliente.delete({ where: { id } });

        return NextResponse.json({
            success: true,
            message: `La pantalla ${pantalla.nombre} fue eliminada.`,
        });
    } catch (error) {
        console.error("Error eliminando pantalla:", error);
        return NextResponse.json(
            { success: false, error: "No fue posible eliminar la pantalla." },
            { status: 500 }
        );
    }
}
