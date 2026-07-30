import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

const ROOMS_VALIDAS = [
    "VIP",
    "SALA_1",
    "SALA_2",
    "SALA_3",
];

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const body = await request.json();

        if (body.verticalRoom !== null &&
            body.verticalRoom !== undefined &&
            !ROOMS_VALIDAS.includes(body.verticalRoom)
        ) {
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