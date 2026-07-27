import { prisma } from "@/src/lib/prisma";
import { CondolenceDTO } from "@/src/dto/condolence.dto";
import { isObituaryAvailable } from "@/src/utils/obituaryAvailability";

export async function createCondolence(
    data: CondolenceDTO, 
    code: string
) {

    return prisma.condolencia.create({
        data: {
            codigo: code,
            obituarioId: data.obituaryId,
            fullName: data.fullName,
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            phone: data.phone,
            email: data.email || null,
            message: data.message,
            acceptedPrivacyPolicy: data.acceptedTerms,
        },
    });
}

export async function findActiveObituaryById(id: string) {

    const obituary = await prisma.obituario.findFirst({
         where: { id, estado: "ACTIVO" },
        select: { 
            id: true,
            sedeId: true,
            sala: true,
            estado: true,
            name: true,
            surname: true,

            // Necesario para validar disponibilidad
            endDate: true,
            endTime: true,
        },
    });

    if (!obituary) {
        return null;
    }

    // Puede estar en estado ACTIVO en la BD, pero haber llegado a su fecha/hora de ocultamiento.
    if (!isObituaryAvailable(obituary)) {
        return null;
    }

    return obituary;
}