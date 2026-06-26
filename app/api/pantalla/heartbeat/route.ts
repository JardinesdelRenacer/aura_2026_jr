import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function PUT(request:Request) {
    try {

        const body = await request.json();

        if (!body.sedeId) {
            return NextResponse.json({ success: false, error: "sedeId requerido" }, { status: 400 });            
        }

        // Actualiza el heartbeat de la sede
        await prisma.sede.update({
            where: { id: body.sedeId },

            data: { lastSeen: new Date()},
        });
        
        // Guarda la información del cliente conectado
        await prisma.pantallaCliente.upsert({
            where: { sedeId: body.sedeId },

            update: {
                screenWidth: body.screen?.width,
                screenHeight: body.screen?.height,

                viewportWidth: body.viewport?.width,
                viewportHeight: body.viewport?.height,

                userAgent: body.userAgent,

                language: body.language,

                online: body.online,
            },

            create: {
                sedeId: body.sedeId,

                screenWidth: body.screen?.width,
                screenHeight: body.screen?.height,

                viewportWidth: body.viewport?.width,
                viewportHeight: body.viewport?.height,

                userAgent: body.userAgent,

                language: body.language,

                online: body.online,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ success: false }, { status: 500 });
    }
}