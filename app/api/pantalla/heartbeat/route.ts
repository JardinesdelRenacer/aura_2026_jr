import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";
import { EstadoPantalla } from "@prisma/client";
import { headers } from "next/headers";

export async function PUT(request:Request) {
    try {
        const body = await request.json();

        const cookieStore = await cookies();

        const token = cookieStore.get("pantalla_token")?.value;

        console.log("TOKEN", token);

        if (!token) {
            return NextResponse.json({ success: false, error: "Token de pantalla no encontrado" }, { status: 401 });
        }

        const pantalla = await prisma.pantallaCliente.findUnique({
            where: { token: token },
        });

        console.log("PANTALLA", pantalla);

        if (!pantalla) {
            return NextResponse.json({ success: false, error: "Pantalla no encontrada" }, { status: 404 });
        }

        const headerList = await headers();

        const ip =
            headerList.get("x-forwarded-for") ??
            headerList.get("x-real-ip") ??
            null;

        await prisma.pantallaCliente.update({
            where: { id: pantalla.id },
            data: { 
                online: true,
                estado: EstadoPantalla.ONLINE,
                lastSeen: new Date(),
                screenWidth: body.screen?.width,
                screenHeight: body.screen?.height,
                viewportWidth: body.viewport?.width,
                viewportHeight: body.viewport?.height,
                language: body.language,
                userAgent: body.userAgent,
                ip,
            },
        });
        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ success: false }, { status: 500 });
    }
}