import { NextRequest, NextResponse } from "next/server";

import { BusinessError } from "@/src/errors/BusinessError";
import { registerAuraToch } from "@/src/services/auraTouchService";
import { RegisterAuraTouchDTO } from "@/src/dto/RegisterAuraTouchDTO";

export async function POST(request: NextRequest) {
    try {
        const body: RegisterAuraTouchDTO = await request.json();

        const result = await registerAuraToch({
            codigo: body.codigo,
            nombre: body.nombre,
            userAgent: request.headers.get("user-agent") ?? undefined,
            ip:
                request.headers.get("x-forwarded-for") ??
                request.headers.get("x-real-ip") ??
                undefined,
        });

        return NextResponse.json({ success: true, data: result })
    } catch (error) {
        console.error(error);

        if (error instanceof BusinessError) {
            return NextResponse.json({
                success: false,
                message: error.message
            },
            {
                status: error.statusCode
            })
        };
    }

    return NextResponse.json({ success: false, message: "Error interno del servidor con aura"}, { status: 500 });
}