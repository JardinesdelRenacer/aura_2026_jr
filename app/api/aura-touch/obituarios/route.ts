import {
    NextRequest,
    NextResponse,
} from "next/server";

import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const token =
            request.cookies.get(
                "aura_touch_token"
            )?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Tableta no registrada.",
                },
                {
                    status: 401,
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            );
        }

        const auraTouch =
            await prisma.auraTouch.findUnique({
                where: {
                    token,
                },
                select: {
                    id: true,
                    activo: true,
                    sedeId: true,

                    sede: {
                        select: {
                            numeroSalas: true,
                            salaVip: true,
                        },
                    },
                },
            });

        if (!auraTouch) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La tableta registrada no existe.",
                },
                { status: 404 }
            );
        }

        if (!auraTouch.activo) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La tableta se encuentra inactiva.",
                },
                { status: 403 }
            );
        }

        const rooms: string[] = [];

        const numeroSalas = Math.min(
            Math.max(
                auraTouch.sede.numeroSalas,
                0
            ),
            3
        );

        for (
            let index = 1;
            index <= numeroSalas;
            index++
        ) {
            rooms.push(`SALA_${index}`);
        }

        if (auraTouch.sede.salaVip) {
            rooms.push("VIP");
        }

        const obituarios =
            await prisma.obituario.findMany({
                where: {
                    sedeId: auraTouch.sedeId,

                    sala: {
                        in: rooms,
                    },

                    estado: "ACTIVO",
                },

                orderBy: {
                    sala: "asc",
                },
            });

        return NextResponse.json(
            {
                success: true,
                data: obituarios,
            },
            {
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate",
                },
            }
        );
    } catch (error) {
        console.error(
            "Error obteniendo obituarios Aura Touch:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible obtener los servicios funerarios.",
            },
            { status: 500 }
        );
    }
}