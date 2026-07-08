import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }

) {
    try {
        const body = await request.json();

        const pantalla = await prisma.pantallaCliente.update({
            where: {
                id: params.id
            },

            data: {
                presentacionId: body.presentacionId
            },

            include: {
                presentacion: true
            },
        });

        return NextResponse.json({ success: true, pantalla });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ success: false }, { status: 500 });
    }
}