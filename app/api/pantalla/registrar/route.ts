import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { EstadoPantalla } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { codigo, nombre, screen, viewport, language, userAgent } = body;

        if (!codigo) {
            return NextResponse.json({ success: false, error: "Código requerido" }, { status: 400 });
        }

        if (!nombre) {
            return NextResponse.json({ success: false, error: "Debe ingresar un nombre para la pantalla." }, { status: 400 });
        }

        //Buscar el código
        const registro = await prisma.codigoRegistro.findUnique({
            where: {
                codigo: codigo
            },
        });

        if (!registro) {
            return NextResponse.json({ success: false, error: "Código inválido" }, { status: 400 });
        }

        // Verificar si el código ha expirado
        if (registro.expiresAt < new Date()) {
            return NextResponse.json({ success: false, error: "Código expirado" }, { status: 400 });
        }

        // Verificar si el código ya ha sido usado
        if (registro.usado) {
            return NextResponse.json({ success: false, error: "Código ya usado" }, { status: 400 });
        }

        // Buscar la presentación principal de la sede
        const presentacion = await prisma.presentacion.findFirst({
            where: {
                sedeId: registro.sedeId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        if (!presentacion) {
            return NextResponse.json({ success: false, error: "No se encontró una presentación para la sede asociada al código." }, { status: 400 });
        }

        // Generar token único para la pantalla
        const token = crypto.randomUUID();

        // Crear la pantalla
        const pantalla = await prisma.pantallaCliente.create({
            data: {
                nombre,
                token,
                sedeId: registro.sedeId,
                presentacionId: presentacion.id,
                estado: EstadoPantalla.ONLINE,
                online: true,
                lastSeen: new Date(),
                screenWidth: screen?.width,
                screenHeight: screen?.height,
                viewportWidth: viewport?.width,
                viewportHeight: viewport?.height,
                language,
                userAgent,
            }
        });

        // Marcar codigo como utilizado
        await prisma.codigoRegistro.update({
            where: { id: registro.id },
            data: { usado: true, utilizadoAt: new Date() },
        });
        
        const response = NextResponse.json({ success: true, token, presentacionId: presentacion?.id });

        response.cookies.set({
            name: "pantalla_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
        });

        console.log("COOKIE CREADA:", token);
        return response;
        
    } catch (error: any) {
        console.error("Error al registrar pantalla:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
