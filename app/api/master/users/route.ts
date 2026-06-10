import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
// Se importa bcrypt para encriptar la contraseña
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword, // luego la encriptamos
        role: "ADMIN",

        sede: {
          create: {
            departamento: body.departamento,
            ciudad: body.ciudad,
            nombre: body.nombreSede,
          },
        },
      },
      include: {
        sede: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
        console.error("ERROR MASTER USERS:");
        console.error(error);

        return NextResponse.json(
            {
            success: false,
            error: String(error)
            },
            { status: 500 }
        );
    }
}
