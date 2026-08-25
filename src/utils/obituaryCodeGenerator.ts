import { prisma } from "@/src/lib/prisma";

export async function generateObituaryCode() {
    const year = new Date().getFullYear();

    const prefix = `OBI-${year}-`;

    const lastObituary = await prisma.obituario.findFirst({
        where: { 
            codigo: {
                startsWith: prefix,
            },
        },

        orderBy: {
            codigo: "desc",
        },

        select: {
            codigo: true,
        },
    });

    let nextNumber = 1;

    if (lastObituary?.codigo) {
        const lastNumber = Number(
            lastObituary.codigo.split("-").pop()
        );

        if (!Number.isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }

    return `${prefix}${String(nextNumber).padStart(6, "0")}`;
    
}