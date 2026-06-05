import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    console.log('[api/auth/login] request received');
    try {
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            console.warn('[api/auth/login] unsupported content-type:', contentType);
            return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });
        }

        let body: any = null;
        try {
            body = await req.json();
        } catch (parseErr) {
            console.error('[api/auth/login] JSON parse error:', parseErr);
            return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
        }

        console.log('[api/auth/login] body:', body);
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
    } catch (error: any) {
        console.error("ERROR en autenticación:", error && error.stack ? error.stack : error);

        return NextResponse.json(
            {
                success: false,
                error: "Error en el servidor durante la autenticación",
            },
            { status: 500 }
        );
    }
}
