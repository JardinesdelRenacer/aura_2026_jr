import { cookies } from 'next/headers';
import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export default async function Display() {
    const cookieStore = await cookies();
    const token = cookieStore.get("pantalla_token")?.value;
    if (!token) {
        redirect("/display/registrar");
    }

    const pantalla = await prisma.pantallaCliente.findUnique({
        where: {
            token: token,
        },
        include: {
            presentacion: true,
            sede: true,
        },
    });

    if (!pantalla) {
        redirect("/display/registrar");
    }

    if (!pantalla?.presentacion) {
        redirect("/display/registrar");
    }
    redirect(`/display/${pantalla.presentacion.id}`);
}