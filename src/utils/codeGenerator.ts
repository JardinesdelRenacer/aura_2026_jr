import { prisma } from "@/src/lib/prisma";

export async function generateSequentialCode(prefix: string): Promise<string> {

    const lastCondolence = await prisma.condolencia.findFirst({
        orderBy: { createdAt: "desc" },
        select: { codigo: true },
    });

    const year = new Date().getFullYear();

    let nextNumber = 1;

    if (lastCondolence?.codigo) {
        const parts = lastCondolence.codigo.split("-");

        if (parts.length === 3) {
            nextNumber = Number(parts[2]) + 1;
        }
    }

    return `${prefix}-${year}-$(String(nextNumber).padStart(6, "0"))`;
    
}