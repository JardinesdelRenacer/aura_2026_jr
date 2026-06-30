import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log("POST MEDIA RECIBIDO");
        console.log(body);

        const ultimo = await prisma.media.count({
            where: {
                sedeId:
                    body.sedeId,
            },
        });

        const media = await prisma.media.create({
            data: {
                sedeId: body.sedeId,
                url: body.url,
                type: body.type,
                orden: ultimo + 1,
                fileName: body.fileName,
                room: body.room || null,
            },
        });
        
        return NextResponse.json({
            success: true,
            data: media,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ success: false, }, { status: 500, });
    }
}

export async function GET(request: Request) {
    try{
        

        const { searchParams } = new URL(request.url);

        const sedeId = searchParams.get("sedeId");
        const room = searchParams.get("room");

        if (!sedeId) {
            return NextResponse.json({ success: false, error: "sedeId requerido"}, { status: 400 });
        }

        const where: { sedeId: string, room?: string } = { sedeId };
        if (room) {
            where.room = room;
        }

        const media = await prisma.media.findMany({
            where,
            orderBy: { orden: "asc"}
        });

        return NextResponse.json({
            success: true,
            data: media
        });
    } catch (error) {
        console.error(error);
        
        return NextResponse.json({ success: false,}, { status: 500 });
    }
}
