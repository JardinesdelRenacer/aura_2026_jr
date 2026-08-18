import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import { isObituaryAvailable } from "@/src/utils/obituaryAvailability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Contrato público de solo lectura para la web de Jardines del Renacer.
 * No expone datos de acceso, contactos ni condolencias.
 */
export async function GET() {
    try {
        const obituarios = await prisma.obituario.findMany({
            where: { estado: "ACTIVO" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                surname: true,
                dob: true,
                dod: true,
                sala: true,
                timeStart: true,
                timeEnd: true,
                cemetery: true,
                endDate: true,
                endTime: true,
                massTime: true,
                massChurch: true,
                massChurchType: true,
                massAddress: true,
                createdAt: true,
                updatedAt: true,
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

        const data = obituarios.filter((obituario) =>
            isObituaryAvailable(obituario),
        );

        return NextResponse.json(
            { success: true, data },
            {
                headers: {
                    "Cache-Control": "no-store, max-age=0",
                },
            },
        );
    } catch (error) {
        console.error("ERROR GET obituarios publicos:", error);
        return NextResponse.json(
            { success: false, error: "No fue posible consultar los obituarios." },
            { status: 500 },
        );
    }
}
