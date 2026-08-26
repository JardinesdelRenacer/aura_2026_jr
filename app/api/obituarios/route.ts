import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

import { generateObituaryCode } from "@/src/utils/obituaryCodeGenerator";

import {
    listActiveObituaries,
} from "@/src/services/obituaryService";

export async function GET() {
    try {
        const obituarios =
            await listActiveObituaries();

        return NextResponse.json({
            success: true,
            data: obituarios,
        });
    } catch (error) {
        console.error(
            "ERROR GET obituarios:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible obtener los obituarios",
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const obituarios =
            body?.obituarios;

        if (
            !obituarios ||
            typeof obituarios !== "object"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Obituarios inválidos",
                },
                {
                    status: 400,
                }
            );
        }

        // ==============================
        // OBTENER SEDE
        // ==============================

        let sedeId = body?.sedeId;

        if (!sedeId) {
            const sede =
                await prisma.sede.findFirst();

            if (!sede) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "No hay sede disponible. Cree una sede primero.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            sedeId = sede.id;
        }

        // ==============================
        // PROCESAR CADA SALA
        // ==============================

        for (const [sala, ob] of Object.entries(
            obituarios
        ) as [string, any][]) {

            const name =
                ob?.name?.trim() || "";

            const surname =
                ob?.surname?.trim() || "";

            /*
             * Si la sala viene vacía,
             * no creamos un obituario.
             */
            if (!name && !surname) {
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
                if (actual) {
                  await prisma.obituario.update({
                    where: {
                      id: actual.id,
                    },
                    data: {
                      estado: "FINALIZADO",
                    },
                  });
                }
                continue;
            }

            // ==============================
            // BUSCAR OBITUARIO ACTIVO
            // ==============================

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

            // ==============================
            // NO EXISTE → CREAR
            // ==============================

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
                            ob?.dob ||
                            null,

                        dod:
                            ob?.dod ||
                            null,

                        timeStart:
                            ob?.timeStart ||
                            null,

                        timeEnd:
                            ob?.timeEnd ||
                            null,

                        cemetery:
                            ob?.cemetery ||
                            null,

                        endTime:
                            ob?.endTime ||
                            null,

                        endDate:
                            ob?.endDate ||
                            null,

                        massDate:
                            ob?.massDate ||
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

            // ==============================
            // DETECTAR CAMBIO DE PERSONA
            // ==============================

            const cambioPersona =
                actual.name.trim()
                    .toLowerCase() !==
                    name.toLowerCase() ||
                actual.surname.trim()
                    .toLowerCase() !==
                    surname.toLowerCase();

            if (cambioPersona) {

                /*
                 * El servicio anterior termina.
                 * NO LO BORRAMOS.
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
                * Se genera código para el nuevo servicio.
                */

                const codigo = await generateObituaryCode();

                // Se crea el nuevo serivico

                await prisma.obituario.create({
                    data: {
                        sedeId,
                        sala,
                        codigo,

                        estado: "ACTIVO",

                        name,
                        surname,

                        dob:
                            ob?.dob ||
                            null,

                        dod:
                            ob?.dod ||
                            null,

                        timeStart:
                            ob?.timeStart ||
                            null,

                        timeEnd:
                            ob?.timeEnd ||
                            null,

                        cemetery:
                            ob?.cemetery ||
                            null,

                        endTime:
                            ob?.endTime ||
                            null,

                        endDate:
                            ob?.endDate ||
                            null,

                        massDate:
                            ob?.massDate ||
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

            // ==============================
            // MISMA PERSONA → ACTUALIZAR
            // ==============================

            await prisma.obituario.update({
                where: {
                    id: actual.id,
                },

                data: {
                    name,
                    surname,

                    dob:
                        ob?.dob ||
                        null,

                    dod:
                        ob?.dod ||
                        null,

                    timeStart:
                        ob?.timeStart ||
                        null,

                    timeEnd:
                        ob?.timeEnd ||
                        null,

                    cemetery:
                        ob?.cemetery ||
                        null,

                    endTime:
                        ob?.endTime ||
                        null,

                    endDate:
                        ob?.endDate ||
                        null,

                    massDate:
                        ob?.massDate ||
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
            "ERROR POST obituarios:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error desconocido",
            },
            {
                status: 500,
            }
        );
    }
}
