import { prisma } from "@/src/lib/prisma";

export async function findAuraRegistrationCode(codigo: string) {
    return prisma.codigoRegistro.findUnique({
        where: { codigo },
        include: { 
            sede: {
                select: { id: true, nombre: true, ciudad: true, departamento: true},
            },
        },
    }); 
}

export async function createAuraTouch(
    nombre: string,
    sedeId: string,
    userAgent?: string,
    ip?: string
) {
    return prisma.auraTouch.create({
        data: {
            nombre,
            sedeId,
            userAgent: userAgent || null,
            ip: ip || null,
            lastSeen: new Date(),
        },
        select: {
            id: true,
            nombre: true,
            token: true,
            activo: true,
            sedeId: true,

            sede: {
                select: {
                    id: true,
                    nombre: true,
                    ciudad: true,
                    departamento: true,
                },
            },
        },
    });    
}

export async function markAuraRegistrationCodeAsUsed(id: string) {
    return prisma.codigoRegistro.update({
        where: { id },
        data: { usado: true, utilizadoAt: new Date()},
    });
}

// Token
export async function findAuraTouchByToken(token: string) {
    return prisma.auraTouch.findUnique({
        where: { token },
        include: { sede: true },
    });
}

export async function updateLastSeen(id: string) {
    return prisma.auraTouch.update({
        where: { id },
        data: { lastSeen: new Date()}
    });
}