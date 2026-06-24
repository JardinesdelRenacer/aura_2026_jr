import { promises } from "dns";
import { Params } from "next/dist/server/request/params";
import { prisma } from "@/src/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ sedeId: string}> } ) {
    const { sedeId } = await params;
    
    const body = await req.json();

    const configuracion = 
        await prisma.configuracionPantalla.upsert({
            where: { sedeId },
            update: {
                autoPlay: body.autoPlay,
                seconds: body.seconds,
                transitionEffect: body.transitionEffect 
            },
            create: {
                sedeId,
                autoPlay: body.autoPlay,
                seconds: body.seconds,
                transitionEffect: body.transitionEffect
            }
        });

    return Response.json({
        success: true,
        data: configuracion
    });
}