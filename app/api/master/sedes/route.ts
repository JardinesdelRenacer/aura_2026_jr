import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma"; // Ajustar a la ruta real de su instancia de Prisma
import { error } from "console";


const MIN_SALAS = 1;
const MAX_SALAS = 3;

export async function GET() {
    try {
        const sedes = await prisma.sede.findMany({
            include: {
                admin: {
                    select: { email: true, nombres: true, apellidos: true },
                },

                presentaciones: true,
                configuracion: true,
                media: true,
                obituarios: true,

                pantallas: {
                    include: {
                        presentacion: true,
                    },
                },
                codigos: true,
            },
            orderBy: { createdAt: 'desc'}
        });
        return NextResponse.json({
            success: true,
            data: sedes,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST (request: Request) {
    try {
        const body = await request.json();

        const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
        
        const departamento = typeof body.departamento === "string" ? body.departamento.trim() : "";

        const ciudad = typeof body.ciudad === "string" ? body.ciudad.trim() : null;

        const adminId = typeof body.adminId === "string" && body.adminId.trim() ? body.adminId.trim() : null;

        // los inputs HTML suelen enviar números como texto, por eso convertimos explicitamente el valor
        const numeroSalas = Number(body.numeroSalas);

        const salaVip = body.salaVip === true;

        if (!nombre) {
            return NextResponse.json({ success: false, error: "El nombre de la sede es obligatorio" }, { status: 400 });
        }

        if (!departamento) {
            return NextResponse.json({ success: false, error: "El departamento es obligatorio." }, { status: 400 });
        }

        if (!ciudad) {
            return NextResponse.json({ success: false, error: "La ciudad es obligatoria" }, { status: 400 });
        }

        if (!Number.isInteger(numeroSalas)) {
            return NextResponse.json({ success: false, error: "La cantidad de salas debe ser un número entero." }, { status: 400 });
        }

        if ( numeroSalas < MIN_SALAS || numeroSalas > MAX_SALAS ) {
            return NextResponse.json({ success: false, error: "La sede debe tener entre 1 y 3 salas." }, { status: 400 });
        }

        if (adminId) {
            const administrador = await prisma.user.findUnique({
                where: { id: adminId },
                select: { id: true },
            });

            if (!administrador) {
                return NextResponse.json
                    ({ success: false, error: "El administrador seleccionado no existe.", });
            }
        }

        // Usamos una transacción. Si falla la creación de los obituarios, tampoco quedará creada una sede incompleta
    
        const nuevaSede = await prisma.$transaction(
            async (tx) => {
                const sede = await tx.sede.create({
                    data: {
                        nombre,
                        departamento,
                        ciudad,
                        numeroSalas,
                        salaVip,

                        ...(adminId && {
                            admin: {
                                connect: {
                                    id: adminId
                                },
                            },
                        }),
                    },
                });

                const obituarios = Array.from(
                    {
                        length: numeroSalas 
                    },
                    (_, index) => ({
                        sala: `SALA_${index + 1}`,
                        sedeId: sede.id,
                        name: "",
                        surname: "",
                    })
                );

                if (salaVip) {
                    obituarios.push({
                        sala: "VIP",
                        sedeId: sede.id,
                        name: "",
                        surname: "",
                    });
                }

                await tx.obituario.createMany({
                    data: obituarios,
                });

                return sede;
            }
        );

        return NextResponse.json({ success: true, data: nuevaSede }, { status: 201 });
    } catch ( error ) { 
        console.error("Error creando sede: ", error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "No fue posible crear la sede.",
        }, { status: 500 });
    }
}
