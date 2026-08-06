import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

const CONFIG_ID = "GLOBAL";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const configuracion =
            await prisma.configuracionGlobal.upsert({
                where: {
                    id: CONFIG_ID,
                },

                update: {},

                create: {
                    id: CONFIG_ID,

                    companyName:
                        "Jardines del Renacer",

                    primaryColor:
                        "#2563EB",

                    secondaryColor:
                        "#0F172A",

                    autoplay: true,

                    seconds: 10,

                    transitionEffect:
                        "fade",

                    auraTouchTimeout: 90,

                    keyboardEnabled: true,

                    refreshInterval: 5,

                    maintenanceMode: false,
                },
            });

        return NextResponse.json({
            success: true,
            data: configuracion,
        });
    } catch (error) {
        console.error(
            "Error obteniendo configuración:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible obtener la configuración.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function PUT(
    request: NextRequest
) {
    try {
        const body = await request.json();

        const companyName =
            typeof body.companyName === "string"
                ? body.companyName.trim()
                : "";

        const primaryColor =
            typeof body.primaryColor === "string"
                ? body.primaryColor.trim()
                : "";

        const secondaryColor =
            typeof body.secondaryColor === "string"
                ? body.secondaryColor.trim()
                : "";

        const seconds = Number(body.seconds);

        const refreshInterval = Number(
            body.refreshInterval
        );

        const auraTouchTimeout = Number(
            body.auraTouchTimeout
        );

        if (companyName.length < 3) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "El nombre de la organización debe tener al menos 3 caracteres.",
                },
                {
                    status: 400,
                }
            );
        }

        const colorRegex =
            /^#[0-9A-Fa-f]{6}$/;

        if (!colorRegex.test(primaryColor)) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "El color primario no es válido.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !colorRegex.test(
                secondaryColor
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "El color secundario no es válido.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !Number.isInteger(seconds) ||
            seconds < 5 ||
            seconds > 60
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "El tiempo entre fotografías debe estar entre 5 y 60 segundos.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !Number.isInteger(
                refreshInterval
            ) ||
            refreshInterval < 3 ||
            refreshInterval > 60
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "El intervalo de refresco debe estar entre 3 y 60 segundos.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !Number.isInteger(
                auraTouchTimeout
            ) ||
            auraTouchTimeout < 30 ||
            auraTouchTimeout > 600
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "El tiempo de espera de Aura Touch debe estar entre 30 y 600 segundos.",
                },
                {
                    status: 400,
                }
            );
        }

        const transicionesValidas = [
            "fade",
            "slide",
            "zoom",
        ];

        const transitionEffect =
            typeof body.transitionEffect ===
            "string"
                ? body.transitionEffect
                : "fade";

        if (
            !transicionesValidas.includes(
                transitionEffect
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La transición seleccionada no es válida.",
                },
                {
                    status: 400,
                }
            );
        }

        const configuracion =
            await prisma.configuracionGlobal.upsert({
                where: {
                    id: CONFIG_ID,
                },

                update: {
                    companyName,

                    companyPhone:
                        body.companyPhone?.trim() ||
                        null,

                    companyEmail:
                        body.companyEmail?.trim() ||
                        null,

                    companyWebsite:
                        body.companyWebsite?.trim() ||
                        null,

                    logo:
                        body.logo?.trim() ||
                        null,

                    primaryColor,
                    secondaryColor,

                    autoplay:
                        Boolean(body.autoplay),

                    seconds,

                    transitionEffect,

                    auraTouchTimeout,

                    keyboardEnabled:
                        Boolean(
                            body.keyboardEnabled
                        ),

                    refreshInterval,

                    maintenanceMode:
                        Boolean(
                            body.maintenanceMode
                        ),
                },

                create: {
                    id: CONFIG_ID,

                    companyName,

                    companyPhone:
                        body.companyPhone?.trim() ||
                        null,

                    companyEmail:
                        body.companyEmail?.trim() ||
                        null,

                    companyWebsite:
                        body.companyWebsite?.trim() ||
                        null,

                    logo:
                        body.logo?.trim() ||
                        null,

                    primaryColor,
                    secondaryColor,

                    autoplay:
                        Boolean(body.autoplay),

                    seconds,

                    transitionEffect,

                    auraTouchTimeout,

                    keyboardEnabled:
                        Boolean(
                            body.keyboardEnabled
                        ),

                    refreshInterval,

                    maintenanceMode:
                        Boolean(
                            body.maintenanceMode
                        ),
                },
            });

        return NextResponse.json({
            success: true,
            data: configuracion,
        });
    } catch (error) {
        console.error(
            "Error guardando configuración:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "No fue posible guardar la configuración.",
            },
            {
                status: 500,
            }
        );
    }
}