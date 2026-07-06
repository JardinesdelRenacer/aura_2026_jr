import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { error } from "console";

export async function GET(request: NextRequest) {

    try {
        const codigo = request.nextUrl.searchParams.get("codigo");

        if (!codigo) {
            return NextResponse.json(
                { success: false, error: "Codigo requerido" }, { status: 400 }
            );
        }

        const registro = await prisma.codigoRegistro.findUnique({
            where: { codigo },
        });

        if (!registro) {
            return NextResponse.json(
                { success: false, error: "Código no encontrado "}, { status: 404 })
        }

        if (!registro.usado) {
            return NextResponse.json(
                { success: true, registrada: false });
        }

        const pantalla = await prisma.pantallaCliente.findFirst({
            where: {
                sedeId: registro.sedeId
            },
            
            orderBy: {
                createdAt: "desc"
            },

            include: {
                presentacion: true
            },
        });

        return NextResponse.json(
            { success: true, registrada: true, pantalla });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: error.message }, { status: 500 }
        );
    }
}