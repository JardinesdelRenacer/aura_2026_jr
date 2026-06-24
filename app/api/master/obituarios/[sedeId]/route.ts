import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ sedeId: string }> }
) {
    try {

        const { sedeId } = await params;

        const body = await request.json();

        const obituarios = body.obituaries;

        if (!obituarios) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No llegaron obituarios",
                },
                {
                    status: 400,
                }
            );
        }

        for (const sala of Object.keys(obituarios)) {

            const ob = obituarios[sala];

            await prisma.obituario.upsert({

                where: {
                    sedeId_sala: {
                        sedeId,
                        sala,
                    },
                },

                update: {

                    name: ob.name,
                    surname: ob.surname,

                    dob: ob.dob,
                    dod: ob.dod,

                    timeStart: ob.timeStart,
                    timeEnd: ob.timeEnd,

                    cemetery: ob.cemetery,

                    endDate: ob.endDate,
                    endTime: ob.endTime,

                    massTime: ob.massTime,
                    massChurch: ob.massChurch,
                    massChurchType: ob.massChurchType,
                    massAddress: ob.massAddress,

                },

                create: {

                    sedeId,
                    sala,

                    name: ob.name,
                    surname: ob.surname,

                    dob: ob.dob,
                    dod: ob.dod,

                    timeStart: ob.timeStart,
                    timeEnd: ob.timeEnd,

                    cemetery: ob.cemetery,

                    endDate: ob.endDate,
                    endTime: ob.endTime,

                    massTime: ob.massTime,
                    massChurch: ob.massChurch,
                    massChurchType: ob.massChurchType,
                    massAddress: ob.massAddress,

                },

            });

        }

        return NextResponse.json({
            success: true,
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: String(error),
            },
            {
                status: 500,
            }
        );

    }
}