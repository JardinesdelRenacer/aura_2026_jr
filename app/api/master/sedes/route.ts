import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma"; // Ajustar a la ruta real de su instancia de Prisma

export async function GET() {
    try {
        const sedes = await prisma.sede.findMany({
            include: {
                admin: {
                    select: { email: true, nombres: true, apellidos: true }
                }
            },
            orderBy: { createdAt: 'desc'}
        });
        return NextResponse.json(sedes);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST (request: Request) {
    try {
        const body = await request.json();
        const { nombre, departamento, ciudad, adminId, numeroSalas, salaVip } = body;

        const nuevaSede = await prisma.sede.create({
            data: { 
                nombre,
                departamento,
                ciudad,
                numeroSalas: numeroSalas || 1,
                salaVip: salaVip || false,
                ...(adminId && { admin: {connect: { id: adminId }}}) //Conecta solo si viene un adminId
            }
        });

        const obituarios = [];

        for (let i = 1; i <= numeroSalas; i++) {
            obituarios.push({
                sala: `SALA_${i}`,
                sedeId: nuevaSede.id,
                name: "",
                surname: ""
            });
        }
        if (salaVip) {
            obituarios.push({
                sala: "VIP",
                sedeId: nuevaSede.id,
                name: "",
                surname: ""
            });
        }

        await prisma.obituario.createMany({
            data: obituarios,
        });

        return NextResponse.json({ success: true, data: nuevaSede });
    } catch ( error: any ) {
        return NextResponse.json ({ success: false, error: error.message }, { status: 500 });
    }
}