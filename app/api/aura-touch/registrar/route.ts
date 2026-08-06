import { NextRequest, NextResponse } from "next/server";

import { BusinessError } from "@/src/errors/BusinessError";
import { registerAuraToch } from "@/src/services/auraTouchService";
import type { RegisterAuraTouchDTO } from "@/src/dto/RegisterAuraTouchDTO";

export async function POST(request: NextRequest) {
    try {
        const body =
            (await request.json()) as RegisterAuraTouchDTO;

        const result = await registerAuraToch({
            codigo: body.codigo,
            nombre: body.nombre,
            userAgent:
                request.headers.get("user-agent") ??
                undefined,
            ip:
                request.headers
                    .get("x-forwarded-for")
                    ?.split(",")[0]
                    ?.trim() ??
                request.headers.get("x-real-ip") ??
                undefined,
        });

        if (!result.token) {
            throw new Error(
                "El servicio no devolvió el token de Aura Touch."
            );
        }

        const response = NextResponse.json(
            {
                success: true,
                data: {
                    id: result.id,
                    nombre: result.nombre,
                    sedeId: result.sedeId,
                },
            },
            {
                status: 200,
            }
        );

        response.cookies.set({
            name: "aura_touch_token",
            value: result.token,
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });

        return response;
    } catch (error) {
        console.error(
            "Error registrando Aura Touch:",
            error
        );

        if (error instanceof BusinessError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                {
                    status: error.statusCode,
                }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error:
                    "Error interno del servidor con Aura Touch.",
            },
            {
                status: 500,
            }
        );
    }
}