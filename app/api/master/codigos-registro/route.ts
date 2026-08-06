import { randomInt } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

const TIPOS_VALIDOS = [
    "PANTALLA",
    "AURA_TOUCH",
] as const;

type TipoDispositivoValido =
    (typeof TIPOS_VALIDOS)[number];

function generarCodigoAuraTouch() {
    const numero = randomInt(100000, 999999);

    return `AURA${numero}`;
}

function generarCodigoPantalla() {
    const numero = randomInt(100000, 999999);

    return `TV${numero}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const sedeId =
            typeof body.sedeId === "string"
                ? body.sedeId.trim()
                : "";

        const tipoDispositivo =
            typeof body.tipoDispositivo === "string"
                ? body.tipoDispositivo.trim().toUpperCase()
                : "";

        if (!sedeId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "La sede es obligatoria.",
                },
                { status: 400 }
            );
        }

        if (
            !TIPOS_VALIDOS.includes(
                tipoDispositivo as TipoDispositivoValido
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "El tipo de dispositivo no es válido.",
                },
                { status: 400 }
            );
        }

        const sede = await prisma.sede.findUnique({
            where: {
                id: sedeId,
            },
            select: {
                id: true,
                nombre: true,
            },
        });

        if (!sede) {
            return NextResponse.json(
                {
                    success: false,
                    error: "La sede seleccionada no existe.",
                },
                { status: 404 }
            );
        }

        let codigo = "";
        let disponible = false;
        let intentos = 0;

        while (!disponible && intentos < 10) {
            codigo =
                tipoDispositivo === "AURA_TOUCH"
                    ? generarCodigoAuraTouch()
                    : generarCodigoPantalla();

            const existente =
                await prisma.codigoRegistro.findUnique({
                    where: {
                        codigo,
                    },
                    select: {
                        id: true,
                    },
                });

            disponible = !existente;
            intentos++;
        }

        if (!disponible) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "No fue posible generar un código único.",
                },
                { status: 500 }
            );
        }

        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const codigoRegistro =
            await prisma.codigoRegistro.create({
                data: {
                    codigo,
                    sedeId,
                    tipoDispositivo:
                        tipoDispositivo as TipoDispositivoValido,
                    usado: false,
                    expiresAt,
                },
                select: {
                    id: true,
                    codigo: true,
                    tipoDispositivo: true,
                    usado: true,
                    expiresAt: true,
                    sede: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },
            });

        return NextResponse.json(
            {
                success: true,
                data: codigoRegistro,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Error generando código de registro:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible generar el código de registro.",
            },
            { status: 500 }
        );
    }
}