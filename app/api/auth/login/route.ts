import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import {
    createSession,
    SESSION_COOKIE,
    SESSION_DURATION_SECONDS,
} from "@/src/lib/auth-session";

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });
        }

        let body: any = null;
        try {
            body = await req.json();
        } catch (parseErr) {
            console.error('[api/auth/login] JSON parse error:', parseErr);
            return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
        }

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

        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase().trim(),
            },
            include: {
                sede: true,
            },
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

        if (user.estado === "SUSPENDIDO") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Tu cuenta ha sido suspendida. Contacta al administrador." 
            
                },
                { status: 403 }
            );
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Credenciales inválidas",
                },
                { status: 401 }
            );
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { lastSeen: new Date() },
        });


        const session = await createSession({
            userId: user.id,
            email: user.email,
            role: user.role,
            sedeId: user.sede?.id ?? null,
        });
        const response = NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    sedeId: user.sede?.id ?? null,
                },
            },
            { status: 200 }
        );
        response.cookies.set(SESSION_COOKIE, session, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: SESSION_DURATION_SECONDS,
        });

        return response;
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
