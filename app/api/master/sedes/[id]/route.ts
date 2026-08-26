import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { MAX_SALAS, MIN_SALAS, getRooms } from "@/src/lib/rooms";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }>}) {
    try {
        const { id } = await params;

        const sede = await prisma.sede.findUnique({
            where: {
                id,
            },
            include: {
                media: true,
                // Los obituarios activos se veran en el Fronted
                obituarios: {
                    where: { estado: "ACTIVO" },
                    orderBy: { createdAt: "desc" },
                },

                configuracion: true,
                admin: true,
            },
        });

        if (!sede) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Sede no encontrada.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ok: true,
            sede,
        });
    } catch (error: any) {
        console.error("ERROR SEDES: ");
        console.error(error);

        return NextResponse.json(
            {
                ok: false,
                message:
                    error instanceof Error ? error.message : "Error obteniendo la sede",
            },
            {
                status: 500,
            }
        );
    }
    
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
        const numeroSalas = Number(body.numeroSalas);
        const salaVip = body.salaVip === true;
        const adminId = typeof body.adminId === "string" && body.adminId.trim()
            ? body.adminId.trim()
            : null;

        if (!nombre) {
            return NextResponse.json({ success: false, error: "El nombre de la sede es obligatorio." }, { status: 400 });
        }

        if (!Number.isInteger(numeroSalas) || numeroSalas < MIN_SALAS || numeroSalas > MAX_SALAS) {
            return NextResponse.json({ success: false, error: `La sede debe tener entre ${MIN_SALAS} y ${MAX_SALAS} salas.` }, { status: 400 });
        }

        const sede = await prisma.sede.findUnique({
            where: { id },
            select: { id: true, numeroSalas: true, salaVip: true },
        });

        if (!sede) {
            return NextResponse.json({ success: false, error: "La sede no existe." }, { status: 404 });
        }

        if (adminId) {
            const admin = await prisma.user.findUnique({ where: { id: adminId }, select: { id: true } });
            if (!admin) {
                return NextResponse.json({ success: false, error: "El administrador seleccionado no existe." }, { status: 400 });
            }
        }

        const previousRooms = getRooms(sede.numeroSalas, sede.salaVip);
        const nextRooms = getRooms(numeroSalas, salaVip);
        const roomsToDisable = previousRooms.filter((room) => !nextRooms.includes(room));

        if (roomsToDisable.length) {
            const [activeServices, media] = await Promise.all([
                prisma.obituario.findMany({
                    where: { sedeId: id, sala: { in: roomsToDisable }, estado: "ACTIVO", OR: [{ name: { not: "" } }, { surname: { not: "" } }] },
                    select: { sala: true },
                }),
                prisma.media.findMany({ where: { sedeId: id, room: { in: roomsToDisable } }, select: { room: true } }),
            ]);

            const occupiedRooms = [...new Set([...activeServices.map((item) => item.sala), ...media.map((item) => item.room).filter(Boolean)])];
            if (occupiedRooms.length) {
                return NextResponse.json({
                    success: false,
                    error: `No se pueden quitar ${occupiedRooms.join(", ")} porque tienen un servicio activo o multimedia. Libera o traslada su contenido primero.`,
                }, { status: 409 });
            }
        }

        const roomsToCreate = nextRooms.filter((room) => !previousRooms.includes(room));

        const updated = await prisma.$transaction(async (tx) => {
            const updatedSede = await tx.sede.update({
                where: { id },
                data: { nombre, numeroSalas, salaVip, adminId },
            });

            await tx.presentacion.updateMany({
                where: { sedeId: id },
                data: { roomsToShow: nextRooms },
            });

            if (roomsToDisable.length) {
                await tx.pantallaCliente.updateMany({
                    where: { sedeId: id, verticalRoom: { in: roomsToDisable } },
                    data: { verticalRoom: null },
                });
            }

            if (roomsToCreate.length) {
                const existing = await tx.obituario.findMany({
                    where: { sedeId: id, sala: { in: roomsToCreate }, estado: "ACTIVO" },
                    select: { sala: true },
                });
                const existingRooms = new Set(existing.map((item) => item.sala));
                const missing = roomsToCreate.filter((room) => !existingRooms.has(room));
                if (missing.length) {
                    await tx.obituario.createMany({
                        data: missing.map((sala) => ({ sedeId: id, sala, name: "", surname: "" })),
                    });
                }
            }

            return updatedSede;
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error actualizando sede:", error);
        return NextResponse.json({ success: false, error: "No fue posible actualizar la sede." }, { status: 500 });
    }
}
