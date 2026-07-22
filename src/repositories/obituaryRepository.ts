import { prisma } from "@/src/lib/prisma";

export async function getActiveObituaries() {

    const [
        totalObituaries,
        activeObituaries,
        finishedObituaries,
        archivedObituaries,
    ] = await Promise.all([
        prisma.obituario.count(),
        prisma.obituario.count({
            where: { estado: "ACTIVO"},
        }),
        prisma.obituario.count({
            where: { estado: "FINALIZADO"},
        }),
        prisma.obituario.count({
            where: { estado: "ARCHIVADO"},
        }),
    ]);
    
    return prisma.obituario.findMany({
        where: { estado: "ACTIVO" },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, surname: true, sala: true, timeStart: true, timeEnd: true, massTime: true, massChurch: true, massChurchType: true, massAddress: true },
    });
}

export async function findObituaryById(id: string) {
    return prisma.obituario.findUnique({
        where: { id }
    });
}
