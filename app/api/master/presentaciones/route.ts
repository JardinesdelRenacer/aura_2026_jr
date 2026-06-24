import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: Request) {
    try {

        const { searchParams } = new URL(req.url);

        const sedeId = searchParams.get("sedeId");

        if (!sedeId) {

            const presentaciones = await prisma.presentacion.findMany({
                include:{
                    sede:true
                }
            });

            return NextResponse.json({
                success:true,
                data:presentaciones
            });
        }

        const presentacion = await prisma.presentacion.findFirst({
            where:{
                sedeId
            }
        });

        return NextResponse.json({
            success:true,
            data:presentacion
        });

    } catch(error){

        console.error(error);

        return NextResponse.json({
            success:false
        },{status:500});

    }

}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const existente = await prisma.presentacion.findFirst({
            where: {
                sedeId: body.sedeId
            }
        });

        if(existente){

            return NextResponse.json({
                success: true,
                id: existente.id
            });
        }

        const presentacion = 
            await prisma.presentacion.create({
                data: {
                    nombre: body.nombre,
                    projectionMode: body.projectionMode ?? "classic",
                    selectedImage: body.selectedImage ?? 0,
                    roomsToShow: body.roomsToShow ?? [],
                    obituaries: body.obituaries ?? {},
                    
                    sede: { connect: { id: body.sedeId, },},
                },
            });

        return NextResponse.json({ success: true, id: presentacion.id });

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
