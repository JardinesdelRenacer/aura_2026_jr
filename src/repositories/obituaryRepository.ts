import { prisma } from "@/src/lib/prisma";
import { isObituaryAvailable } from "@/src/utils/obituaryAvailability";


export async function getActiveObituaries() {
    const obituaries = await prisma.obituario.findMany({
        where: { estado: "ACTIVO"}, 
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, surname: true, sala: true,  estado: true, timeStart: true, timeEnd: true,  endDate: true, endTime: true, massTime: true, massChurch: true, massChurchType: true, massAddress: true },
    });

    // IMPORTANTE: Primsa obtiene los estado ACTION_VERSION_INFO, pero aquí eliminamos los que ya superan su fecha/hora de ocultamiento.
    return obituaries.filter((obituary) => {
        return isObituaryAvailable(obituary);
    });
}

export async function findObituaryById(id: string) {
    const obituary = await prisma.obituario.findFirst({
        where: { id, estado: "ACTIVO"},
        select: { id: true, sedeId: true, sala: true,  estado: true, name: true, surname: true, endDate: true, endTime: true },
    });

    if (!obituary) {
        return null;
    }

    //Puede existir y estar activo en la BD pero si supera la fecha/hora de ocultamiento
    if (!isObituaryAvailable(obituary)) {
        return null;
    }
    return obituary;
}
