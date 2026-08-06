import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const sedeId =
            request.nextUrl.searchParams.get("sedeId");

        const obituarioId =
            request.nextUrl.searchParams.get("obituarioId");

        /*
         * Si solo recibimos sedeId, devolvemos los
         * obituarios disponibles de esa sede.
         */
        if (sedeId && !obituarioId) {
            const obituarios =
                await prisma.obituario.findMany({
                    where: {
                        sedeId,
                    },

                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        sala: true,
                        estado: true,
                        createdAt: true,

                        _count: {
                            select: {
                                condolencias: true,
                            },
                        },
                    },

                    orderBy: [
                        {
                            estado: "asc",
                        },
                        {
                            sala: "asc",
                        },
                    ],
                });

            return NextResponse.json(
                {
                    success: true,
                    data: obituarios,
                },
                {
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            );
        }

        /*
         * Si recibimos obituarioId, devolvemos toda la
         * información necesaria para visualizar y exportar.
         */
        if (obituarioId) {
            const obituario =
                await prisma.obituario.findUnique({
                    where: {
                        id: obituarioId,
                    },

                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        sala: true,
                        estado: true,
                        dob: true,
                        dod: true,
                        createdAt: true,

                        sede: {
                            select: {
                                id: true,
                                nombre: true,
                                ciudad: true,
                                departamento: true,
                            },
                        },

                        condolencias: {
                            select: {
                                id: true,
                                codigo: true,
                                fullName: true,
                                phone: true,
                                message: true,
                                estado: true,
                                createdAt: true,
                            },

                            orderBy: {
                                createdAt: "asc",
                            },
                        },
                    },
                });

            if (!obituario) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "El obituario seleccionado no existe.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    data: obituario,
                },
                {
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error:
                    "Debe seleccionar una sede o un obituario.",
            },
            {
                status: 400,
            }
        );
    } catch (error) {
        console.error(
            "Error generando reporte de condolencias:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible obtener el reporte de condolencias.",
            },
            {
                status: 500,
            }
        );
    }
}