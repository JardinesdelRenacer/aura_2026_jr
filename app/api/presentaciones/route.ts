import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
    try {
        const presentaciones = await prisma.presentacion.findMany();

        return NextResponse.json(presentaciones);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false}, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const presentacion = 
            await prisma.presentacion.create({
                data: {
                    nombre: body.nombre,
                    images: JSON.stringify(body.images),
                    autoPlay: body.autoPlay,
                    seconds: body.seconds,
                },
            });

        return NextResponse.json({success: true, id: presentacion.id});

    }  catch (error) {
        console.error("ERROR API:");
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: String(error),
            },
            { status: 500 }
        );
    }
    
}
