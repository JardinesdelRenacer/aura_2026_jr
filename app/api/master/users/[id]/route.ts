import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;
        const body = await request.json();
        
        // Extraemos los datos que nos envía el frontend
        const { nombres, apellidos, cedula, telefono, email, password, departamento, ciudad, nombreSede, estado } = body;

        // Preparamos el objeto de actualización
        const updateData: any = {
            nombres, apellidos, cedula, telefono, email, departamento, ciudad, estado
        };

        // Si el frontend envió una nueva contraseña (no está en blanco), la encriptamos y la guardamos
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Si el frontend envió el nombre de una Sede a conectar, la buscamos y conectamos
        if (nombreSede) {
            const sedeEncontrada = await prisma.sede.findFirst({ where: { nombre: nombreSede } });
            if (sedeEncontrada) {
                updateData.sede = { connect: { id: sedeEncontrada.id } };
            }
        } else {
            // Si viene vacío, lo desconectamos de su sede actual
            updateData.sede = { disconnect: true };
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.user.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}