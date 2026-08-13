import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const token =
            request.cookies.get("aura_touch_token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Tableta no registrada.",
                },
                { status: 401 }
            );
        }

        const auraTouch =
            await prisma.auraTouch.findUnique({
                where: {
                    token,
                },
                select: {
                    id: true,
                    nombre: true,
                    activo: true,
                    sede: {
                        select: {
                            id: true,
                            nombre: true,
                            ciudad: true,
                            departamento: true,
                            numeroSalas: true,
                            salaVip: true,
                        },
                    },
                },
            });

        if (!auraTouch || !auraTouch.activo) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La tableta no existe o está inactiva.",
                },
                { status: 404 }
            );
        }

        // Consultar la configuración desde el propio dispositivo confirma que
        // la tableta sigue disponible, incluso antes de abrir el formulario.
        await prisma.auraTouch.update({
            where: { id: auraTouch.id },
            data: { lastSeen: new Date() },
        });

        const rooms: string[] = [];

        for (
            let i = 1;
            i <= auraTouch.sede.numeroSalas;
            i++
        ) {
            rooms.push(`SALA_${i}`);
        }

        if (auraTouch.sede.salaVip) {
            rooms.push("VIP");
        }

        return NextResponse.json({
            success: true,
            data: {
                auraTouch: {
                    id: auraTouch.id,
                    nombre: auraTouch.nombre,
                },
                sede: auraTouch.sede,
                rooms,
            },
        });
    } catch (error) {
        console.error(
            "Error obteniendo configuración Aura Touch:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible obtener la configuración.",
            },
            { status: 500 }
        );
    }
}
