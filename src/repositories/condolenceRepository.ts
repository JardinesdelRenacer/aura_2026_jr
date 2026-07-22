import { prisma } from "@/src/lib/prisma";
import { CondolenceDTO } from "@/src/dto/condolence.dto";

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