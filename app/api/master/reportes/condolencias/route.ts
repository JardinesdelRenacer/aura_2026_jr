import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const sedeId =
            request.nextUrl.searchParams.get("sedeId");

        const obituarioId =
            request.nextUrl.searchParams.get("obituarioId");

        const search =
            request.nextUrl.searchParams
                .get("search")
                ?.trim() || "";

        const estado =
            request.nextUrl.searchParams.get("estado");

        // =====================================================
        // 1. OBTENER UN OBITUARIO ESPECÍFICO
        // =====================================================

        if (obituarioId) {
            const obituario =
                await prisma.obituario.findUnique({
                    where: {
                        id: obituarioId,
                    },

                    select: {
                        id: true,
                        codigo: true,

                        name: true,
                        surname: true,

                        sala: true,
                        estado: true,

                        dob: true,
                        dod: true,

                        createdAt: true,
                        updatedAt: true,

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

                                documentType: true,
                                documentNumber: true,

                                phone: true,
                                email: true,

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

        // =====================================================
        // 2. LISTAR OBITUARIOS DE UNA SEDE
        // =====================================================

        if (sedeId) {
            const where: any = {
                sedeId,
            };

            // =================================================
            // FILTRO POR ESTADO
            // =================================================

            if (
                estado === "ACTIVO" ||
                estado === "FINALIZADO" ||
                estado === "ARCHIVADO"
            ) {
                where.estado = estado;
            }

            // =================================================
            // BUSCADOR
            // =================================================

            if (search) {
                where.OR = [
                    {
                        codigo: {
                            contains: search,
                        },
                    },
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        surname: {
                            contains: search,
                        },
                    },
                    {
                        sala: {
                            contains: search,
                        },
                    },
                ];
            }

            const obituarios =
                await prisma.obituario.findMany({
                    where,

                    select: {
                        id: true,
                        codigo: true,

                        name: true,
                        surname: true,

                        sala: true,
                        estado: true,

                        dob: true,
                        dod: true,

                        createdAt: true,
                        updatedAt: true,

                        _count: {
                            select: {
                                condolencias: true,
                            },
                        },
                    },

                    /*
                     * Primero mostramos los servicios
                     * más recientes.
                     */
                    orderBy: {
                        createdAt: "desc",
                    },
                });

            return NextResponse.json(
                {
                    success: true,
                    data: obituarios,
                    total: obituarios.length,
                },
                {
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            );
        }

        // =====================================================
        // 3. FALTAN PARÁMETROS
        // =====================================================

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