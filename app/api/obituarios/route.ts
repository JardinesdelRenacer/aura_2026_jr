import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

import { listActiveObituaries } from "@/src/services/obituaryService";

export async function GET() {
  try {
    const obituarios = await listActiveObituaries();

    return NextResponse.json({ success: true, data: obituarios });
  } catch (error) {
    console.error("ERROR GET obituarios:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const obituarios = body?.obituarios;

    if (!obituarios || typeof obituarios !== "object") {
      return NextResponse.json({ success: false, error: "Obituarios inválidos" }, { status: 400 });
    }

    let sedeId = body?.sedeId;
    if (!sedeId) {
      const sede = await prisma.sede.findFirst();
      if (!sede) {
        return NextResponse.json({ success: false, error: "No hay sede disponible. Cree una sede primero." }, { status: 404 });
      }
      sedeId = sede.id;
    }

    const records = Object.entries(obituarios).map(([sala, ob]: [string, any]) => ({
      sedeId,
      sala,
      name: ob?.name || "",
      surname: ob?.surname || "",
      dob: ob?.dob || null,
      dod: ob?.dod || null,
      timeStart: ob?.timeStart || null,
      timeEnd: ob?.timeEnd || null,
      cemetery: ob?.cemetery || null,
      endTime: ob?.endTime || null,
      endDate: ob?.endDate || null,
      massTime: ob?.massTime || null,
      massChurch: ob?.massChurch || null,
      massChurchType: ob?.massChurchType || "Parroquia",
      massAddress: ob?.massAddress || null,
    }));

    await prisma.obituario.deleteMany({ where: { sedeId } });
    await prisma.obituario.createMany({ data: records });

    return NextResponse.json({ success: true, count: records.length });
  } catch (error) {
    console.error("ERROR POST obituarios:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
