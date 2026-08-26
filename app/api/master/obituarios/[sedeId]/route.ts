
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

            const activos = await prisma.obituario.findMany({
                where: { sedeId, sala, estado: "ACTIVO" },
                orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            });
            const [actual, ...duplicados] = activos;

            // Versiones antiguas podían crear más de un activo mientras se
            // escribía un nombre. Conservamos el más reciente y archivamos
            // los demás para que una sala tenga un único servicio vigente.
            if (duplicados.length) {
                await prisma.obituario.updateMany({
                    where: { id: { in: duplicados.map((item) => item.id) } },
                    data: { estado: "FINALIZADO" },
                });
            }

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
                await prisma.obituario.updateMany({
                    where: { sedeId, sala, estado: "ACTIVO" },
                    data: { estado: "FINALIZADO" },
                });

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

            // Un cambio de texto durante la digitación sigue siendo el mismo
            // servicio. Para iniciar uno nuevo se limpia la sala primero;
            // así no se generan obituarios parciales ni se mezclan traslados.

            await prisma.obituario.update({
                where: {
                    id: actual.id,
                },

                data: {
                    ...(actual.codigo ? {} : { codigo: await generateObituaryCode() }),
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
