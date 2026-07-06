import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

function generarCodigo() {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
        codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return `${codigo.slice(0, 4)}-${codigo.slice(4)}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sedeId  } = body;

        if (!sedeId) {
            return NextResponse.json({ success: false, error: "sedeId requerido" }, { status: 400 });
        }

        // Verifica si ya existe un código no usado y no expirado para la sede
        const existente = await prisma.codigoRegistro.findFirst({
            where: {
                sedeId,
                usado: false,
                expiresAt: {
                    gt: new Date(),
                }
            }
        });

        if (existente) {
            return NextResponse.json({ success: true, codigo: existente.codigo, expiresAt: existente.expiresAt });
        }

        // Crea un nuevo código si no existe uno válido

        let codigo = generarCodigo();

        while (await prisma.codigoRegistro.findUnique({ where: { codigo } })) {
            codigo = generarCodigo();
        }

        // Genera un nuevo código y establece la fecha de expiración a 5 minutos desde ahora
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos en milisegundos

        await prisma.codigoRegistro.create({
            data: {
                codigo,
                sedeId,
                expiresAt,
            },
        });

        return NextResponse.json({ success: true, codigo, expiresAt });
    } catch (error: any) {
        console.error("Error al generar código:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }      
}
