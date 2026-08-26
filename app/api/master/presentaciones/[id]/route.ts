import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { readSession, SESSION_COOKIE } from "@/src/lib/auth-session";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    try {
        const { id } = await params;
        const session = await readSession(
            request.cookies.get(SESSION_COOKIE)?.value
        );
        const pantallaToken = request.cookies.get("pantalla_token")?.value;

        // Una presentación puede verla un usuario autenticado o la pantalla
        // registrada específicamente para esa presentación.
        if (!session && !pantallaToken) {
            return NextResponse.json(
                { success: false, error: "No autorizado" },
                { status: 401 }
            );
        }

        if (!session) {
            const pantalla = await prisma.pantallaCliente.findFirst({
                where: { token: pantallaToken, presentacionId: id },
                select: { id: true },
            });

            if (!pantalla) {
                return NextResponse.json(
                    { success: false, error: "No autorizado" },
                    { status: 401 }
                );
            }
        }

        const presentacion = await prisma.presentacion.findUnique({
            where: { id },

            include: {
                sede: {
                    include: {
                        media: true,
                        obituarios: {
                            where: { estado: "ACTIVO" },
                            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
                        },
                        configuracion: true,
                    },
                },
            },
        });

        if (!presentacion) {
            return NextResponse.json(
                { success: false, error: " Presentación no encontrada "},
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: presentacion,
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "Error obteniendo presentación",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const presentacion = await prisma.presentacion.update({
            where: { id },
            data: {
                projectionMode: body.projectionMode,
                selectedImage: body.selectedImage,

                roomsToShow: body.roomsToShow,
                obituaries: body.obituaries,

                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            data: presentacion,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error: String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE( request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await prisma.presentacion.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json({
            success: false,
            error: "Error eliminando presentación",
        }, { status: 500, });
    }
}
