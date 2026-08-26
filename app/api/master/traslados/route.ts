import {
    NextRequest,
    NextResponse,
} from "next/server";

import { prisma } from "@/src/lib/prisma";
import { getRooms } from "@/src/lib/rooms";

interface TrasladoBody {
    sedeId?: unknown;
    salaOrigen?: unknown;
    salaDestino?: unknown;
    usuarioId?: unknown;
    usuarioEmail?: unknown;
}

function obtenerSalasPermitidas({
    numeroSalas,
    salaVip,
}: {
    numeroSalas: number;
    salaVip: boolean;
}) {
    return getRooms(numeroSalas, salaVip);
}

export async function POST(
    request: NextRequest
) {
    try {
        const body =
            (await request.json()) as TrasladoBody;

        const sedeId =
            typeof body.sedeId === "string"
                ? body.sedeId.trim()
                : "";

        const salaOrigen =
            typeof body.salaOrigen === "string"
                ? body.salaOrigen
                      .trim()
                      .toUpperCase()
                : "";

        const salaDestino =
            typeof body.salaDestino === "string"
                ? body.salaDestino
                      .trim()
                      .toUpperCase()
                : "";

        const usuarioId =
            typeof body.usuarioId === "string" &&
            body.usuarioId.trim()
                ? body.usuarioId.trim()
                : null;

        const usuarioEmail =
            typeof body.usuarioEmail === "string" &&
            body.usuarioEmail.trim()
                ? body.usuarioEmail.trim()
                : null;

        if (!sedeId) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sede es obligatoria.",
                },
                {
                    status: 400,
                }
            );
        }

        if (salaOrigen === salaDestino) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sala de origen y destino no pueden ser iguales.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Verificamos que la sede exista y obtenemos
         * su configuración real de salas.
         */
        const sede =
            await prisma.sede.findUnique({
                where: {
                    id: sedeId,
                },

                select: {
                    id: true,
                    nombre: true,
                    numeroSalas: true,
                    salaVip: true,
                },
            });

        if (!sede) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sede seleccionada no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        const salasPermitidas =
            obtenerSalasPermitidas({
                numeroSalas:
                    sede.numeroSalas,
                salaVip: sede.salaVip,
            });

        if (
            !salasPermitidas.includes(
                salaOrigen
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sala de origen no está habilitada en esta sede.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !salasPermitidas.includes(
                salaDestino
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sala de destino no está habilitada en esta sede.",
                },
                {
                    status: 400,
                }
            );
        }

        const resultado =
            await prisma.$transaction(
                async (tx) => {
                    const origen =
                        await tx.obituario.findFirst({
                            where: {
                                sedeId,
                                sala: salaOrigen,
                                estado: "ACTIVO",
                            },
                            orderBy: {
                                createdAt: "desc",
                            },
                        });

                    const destino =
                        await tx.obituario.findFirst({
                            where: {
                                sedeId,
                                sala: salaDestino,
                                estado: "ACTIVO",
                            },
                            orderBy: {
                                createdAt: "desc",
                            },
                        });

                    if (!origen) {
                        throw new Error(
                            "ORIGEN_NO_ENCONTRADO"
                        );
                    }

                    if (destino) {
                        throw new Error(
                            "DESTINO_OCUPADO"
                        );
                    }

                    const nombreObituario = [
                        origen.name,
                        origen.surname,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .trim();

                    // El servicio conserva su mismo ID y sus condolencias.
                    await tx.obituario.update({
                        where: {
                            id: origen.id,
                        },

                        data: {
                            sala: salaDestino,
                        },
                    });

                    // Las fotos y videos acompañan al servicio trasladado.
                    await tx.media.updateMany({
                        where: {
                            sedeId,
                            room: salaOrigen,
                        },

                        data: {
                            room: salaDestino,
                        },
                    });

                    /*
                     * Registramos el movimiento en el
                     * historial operativo.
                     */
                    const traslado =
                        await tx.trasladoObituario.create({
                            data: {
                                sedeId,

                                obituarioNombre:
                                    nombreObituario,

                                salaOrigen,
                                salaDestino,

                                usuarioId,
                                usuarioEmail,

                                estado:
                                    "COMPLETADO",
                            },

                            include: {
                                sede: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        ciudad: true,
                                        departamento:
                                            true,
                                    },
                                },
                            },
                        });

                    return {
                        traslado,
                        nombreObituario,
                    };
                }
            );

        return NextResponse.json(
            {
                success: true,
                data: resultado,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "Error ejecutando traslado:",
            error
        );

        if (
            error instanceof Error &&
            error.message ===
                "ORIGEN_NO_ENCONTRADO"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sala de origen no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        if (
            error instanceof Error &&
            error.message ===
                "DESTINO_NO_ENCONTRADO"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sala de destino no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        if (
            error instanceof Error &&
            error.message ===
                "ORIGEN_DISPONIBLE"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sala de origen no tiene un obituario activo.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            error instanceof Error &&
            error.message ===
                "DESTINO_OCUPADO"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sala de destino ya está ocupada.",
                },
                {
                    status: 409,
                }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible realizar el traslado.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(
    request: NextRequest
) {
    try {
        const sedeId =
            request.nextUrl.searchParams.get(
                "sedeId"
            );

        /*
         * Si se envía una sede, verificamos que exista
         * antes de consultar el historial.
         */
        if (sedeId) {
            const sedeExiste =
                await prisma.sede.findUnique({
                    where: {
                        id: sedeId,
                    },

                    select: {
                        id: true,
                    },
                });

            if (!sedeExiste) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "La sede seleccionada no existe.",
                    },
                    {
                        status: 404,
                    }
                );
            }
        }

        const traslados =
            await prisma.trasladoObituario.findMany({
                where: sedeId
                    ? {
                          sedeId,
                      }
                    : undefined,

                include: {
                    sede: {
                        select: {
                            id: true,
                            nombre: true,
                            ciudad: true,
                            departamento:
                                true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },

                take: 50,
            });

        return NextResponse.json(
            {
                success: true,
                data: traslados,
            },
            {
                status: 200,

                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate",
                },
            }
        );
    } catch (error) {
        console.error(
            "Error GET /api/master/traslados:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "No fue posible consultar el historial.",
            },
            {
                status: 500,
            }
        );
    }
}
