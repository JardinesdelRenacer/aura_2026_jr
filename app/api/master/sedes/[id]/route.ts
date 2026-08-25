import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

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