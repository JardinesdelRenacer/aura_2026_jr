import { NextRequest, NextResponse } from "next/server";
import { registerCondolence } from "@/src/services/condolenceService";
import { CondolenceDTO } from "@/src/dto/condolence.dto";
import { BusinessError } from "@/src/errors/BusinessError";

export async function POST(request: NextRequest) {
    try {
        const body: CondolenceDTO = await request.json();

        const condolence = await registerCondolence(body);

        console.log(body);

        return NextResponse.json({
            success: true,
            data: condolence,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof BusinessError) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, {
                status: error.statusCode
            }
        );
    }
    return NextResponse.json(
        { success: false, message: "Ocurrió un error interno del servidor."},
        { status: 500 });
    }
}
