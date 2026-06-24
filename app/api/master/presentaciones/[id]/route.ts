import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string }}) {
    try {
        const { id } = params;

        const presentacion = await prisma.presentacion.findUnique({
            where: { id },
        });

        if (!presentacion) {
            return NextResponse.json(
                { success: false, error: " Presentación no encontrada "},
                { status: 400 }
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

        console.log("PATCH RECIBIDO");
        console.log("ID:", id);
        console.log("BODY:", body);

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