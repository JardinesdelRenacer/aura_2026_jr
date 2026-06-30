import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id: userId } = await params;
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
        console.error(error);
        return NextResponse.json({ success: false, error: "Error actualizando usuario" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await prisma.user.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Error al eliminar usuario " }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try{
        const { id } = await params;

        // Busca al usario actual
        const usuario = await prisma.user.findUnique({ where: {id},});

        if (!usuario) {
            return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
        }

        // Alternar estado

        const nuevoEstado = usuario.estado === "SUSPENDIDO" ? "ACTIVO" : "SUSPENDIDO";

        const user = await prisma.user.update({
            where: { id },
            data: { estado: nuevoEstado },
        });
        
        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        console.error(error);
        
        return NextResponse.json(
            {
                success: false,
                error: "error al suspender al usuario",            
            },
            { status: 500, }
        );
    }
}