import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // Validar que existan email y password
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email y contraseña son requeridos",
                },
                { status: 400 }
            );
        }

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Credenciales inválidas",
                },
                { status: 401 }
            );
        }

        // Comparar contraseña hasheada con la proporcionada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Credenciales inválidas",
                },
                { status: 401 }
            );
        }

        // Autenticación exitosa - retornar datos del usuario
        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("ERROR en autenticación:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Error en el servidor durante la autenticación",
            },
            { status: 500 }
        );
    }
}
