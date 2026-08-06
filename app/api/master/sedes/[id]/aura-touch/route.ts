import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
    _request: Request,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        const { id } = await params;

        const sede = await prisma.sede.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                nombre: true,
            },
        });

        if (!sede) {
            return NextResponse.json(
                {
                    success: false,
                    error: "La sede no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        const tabletas = await prisma.auraTouch.findMany({
            where: {
                sedeId: id,
            },
            select: {
                id: true,
                nombre: true,
                activo: true,
                lastSeen: true,
                ip: true,
                userAgent: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: tabletas,
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
            "Error consultando tabletas Aura Touch:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible consultar las tabletas registradas.",
            },
            {
                status: 500,
            }
        );
    }
}