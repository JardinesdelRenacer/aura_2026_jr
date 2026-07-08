import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(request: Request, { params }: Props) {
    try {
        const { id } = await params;

        await prisma.pantallaCliente.update({
            where: { id }, data: { reiniciar: true },
        });

        return NextResponse.json ({ success: true });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ success: false },{ status: 500 });
    }
}