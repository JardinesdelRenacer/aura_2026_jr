import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs"; // Asumiendo que usa bcrypt para contraseñas

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: { sede: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombres, apellidos, cedula, telefono, email, password, departamento, ciudad } = body;

        // Hashear la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                nombres,
                apellidos,
                cedula,
                telefono,
                email,
                password: hashedPassword,
                departamento,
                ciudad,
                role: "ADMIN"
            }
        });

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}