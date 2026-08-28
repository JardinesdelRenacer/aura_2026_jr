import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const tokenQuery =
            request.nextUrl.searchParams.get("token");

        const tokenCookie =
            request.cookies.get("pantalla_token")?.value;

        const token = tokenQuery ?? tokenCookie;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "No se recibió el token de la pantalla.",
                },
                {
                    status: 401,
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            );
        }

        const pantalla =
            await prisma.pantallaCliente.findUnique({
                where: {
                    token,
                },
                select: {
                    id: true,
                    nombre: true,
                    verticalRoom: true,
                    screenRotation: true,
                    presentacionId: true,
                    sedeId: true,
                    estado: true,
                    online: true,
                    lastSeen: true,
                },
            });

        if (!pantalla) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Pantalla no encontrada.",
                },
                {
                    status: 404,
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: pantalla,
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
            "Error obteniendo configuración de pantalla:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "Error obteniendo la configuración de la pantalla.",
            },
            {
                status: 500,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    }
}
