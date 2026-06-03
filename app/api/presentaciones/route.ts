import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";

const prisma = new PrismaClient();

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
        
        console.error(error);

        return NextResponse.json({success: false,},{status:500,});
    
    }
}
