
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { generateObituaryCode } from "@/src/utils/obituaryCodeGenerator";

export async function PUT(
    request: Request,
    {
        params,
    }: {
        params: Promise<{
            sedeId: string;
        }>;
    }
) {
    try {
        const { sedeId } = await params;

        const body = await request.json();

        const obituarios =
            body?.obituaries;

        if (
            !obituarios ||
            typeof obituarios !== "object"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "No llegaron obituarios válidos.",
                },
                {
                    status: 400,
                }
            );
        }

        const sede =
            await prisma.sede.findUnique({
                where: {
                    id: sedeId,
                },
                select: {
                    id: true,
                },
            });

        if (!sede) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La sede no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        for (const sala of Object.keys(
            obituarios
        )) {
            const ob =
                obituarios[sala];

            const name =
                typeof ob?.name === "string"
                    ? ob.name.trim()
                    : "";

            const surname =
                typeof ob?.surname === "string"
                    ? ob.surname.trim()
                    : "";

            // =====================================
            // BUSCAR SERVICIO ACTIVO DE ESTA SALA
            // =====================================

            const actual =
                await prisma.obituario.findFirst({
                    where: {
                        sedeId,
                        sala,
                        estado: "ACTIVO",
                    },

                    orderBy: {
                        createdAt: "desc",
                    },
                });

            // =====================================
            // SALA VACÍA
            // =====================================

            if (!name && !surname) {
                /*
                 * Si había un servicio activo,
                 * lo finalizamos.
                 *
                 * NO se elimina.
                 */
                if (actual) {
                    await prisma.obituario.update({
                        where: {
                            id: actual.id,
                        },

                        data: {
                            estado:
                                "FINALIZADO",
                        },
                    });
                }

                continue;
            }

            // =====================================
            // NO HAY SERVICIO ACTIVO
            // =====================================

            if (!actual) {
                const codigo = await generateObituaryCode();

                await prisma.obituario.create({
                    data: {
                        sedeId,
                        sala,
                        codigo,

                        estado: "ACTIVO",

                        name,
                        surname,

                        dob:
                            ob?.dob || null,

                        dod:
                            ob?.dod || null,

                        timeStart:
                            ob?.timeStart ||
                            null,

                        timeEnd:
                            ob?.timeEnd ||
                            null,

                        cemetery:
                            ob?.cemetery ||
                            null,

                        endDate:
                            ob?.endDate ||
                            null,

                        endTime:
                            ob?.endTime ||
                            null,

                        massTime:
                            ob?.massTime ||
                            null,

                        massChurch:
                            ob?.massChurch ||
                            null,

                        massChurchType:
                            ob?.massChurchType ||
                            "Parroquia",

                        massAddress:
                            ob?.massAddress ||
                            null,
                    },
                });

                continue;
            }

            // =====================================
            // COMPROBAR SI CAMBIÓ LA PERSONA
            // =====================================

            const nombreCambio =
                actual.name
                    .trim()
                    .toLowerCase() !==
                name.toLowerCase();

            const apellidoCambio =
                actual.surname
                    .trim()
                    .toLowerCase() !==
                surname.toLowerCase();

            const cambioPersona =
                nombreCambio ||
                apellidoCambio;

            // =====================================
            // NUEVA PERSONA EN LA MISMA SALA
            // =====================================

            if (cambioPersona) {
                /*
                 * Finalizamos al anterior.
                 */
                await prisma.obituario.update({
                    where: {
                        id: actual.id,
                    },

                    data: {
                        estado:
                            "FINALIZADO",
                    },
                });

                /*
                 * Creamos un servicio NUEVO.
                 */
                const codigo = await generateObituaryCode();

                await prisma.obituario.create({
                    data: {
                        sedeId,
                        sala,
                        codigo,

                        estado: "ACTIVO",

                        name,
                        surname,

                        dob:
                            ob?.dob || null,

                        dod:
                            ob?.dod || null,

                        timeStart:
                            ob?.timeStart ||
                            null,

                        timeEnd:
                            ob?.timeEnd ||
                            null,

                        cemetery:
                            ob?.cemetery ||
                            null,

                        endDate:
                            ob?.endDate ||
                            null,

                        endTime:
                            ob?.endTime ||
                            null,

                        massTime:
                            ob?.massTime ||
                            null,

                        massChurch:
                            ob?.massChurch ||
                            null,

                        massChurchType:
                            ob?.massChurchType ||
                            "Parroquia",

                        massAddress:
                            ob?.massAddress ||
                            null,
                    },
                });

                continue;
            }

            // =====================================
            // MISMA PERSONA
            // =====================================

            await prisma.obituario.update({
                where: {
                    id: actual.id,
                },

                data: {
                    name,
                    surname,

                    dob:
                        ob?.dob || null,

                    dod:
                        ob?.dod || null,

                    timeStart:
                        ob?.timeStart ||
                        null,

                    timeEnd:
                        ob?.timeEnd ||
                        null,

                    cemetery:
                        ob?.cemetery ||
                        null,

                    endDate:
                        ob?.endDate ||
                        null,

                    endTime:
                        ob?.endTime ||
                        null,

                    massTime:
                        ob?.massTime ||
                        null,

                    massChurch:
                        ob?.massChurch ||
                        null,

                    massChurchType:
                        ob?.massChurchType ||
                        "Parroquia",

                    massAddress:
                        ob?.massAddress ||
                        null,
                },
            });
        }

        return NextResponse.json({
            success: true,
        });

    } catch (error) {
        console.error(
            "Error guardando obituarios:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error guardando los obituarios.",
            },
            {
                status: 500,
            }
        );
    }
}
