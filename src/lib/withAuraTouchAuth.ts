import { NextRequest, NextResponse } from "next/server"

import { BusinessError } from "@/src/errors/BusinessError";
import { authenticateAuraTouch } from "@/src/services/auraTouchAuthService";
import { getBearerToken } from "./getBearerToken";

export function withAuraTochAuth(
    handler: (
        request: NextRequest,
        auraTouch: Awaited<ReturnType<typeof authenticateAuraTouch>>
    ) => Promise<NextResponse>
) {
    return async (request: NextRequest) => {
        try {
            const token = getBearerToken(request);

            const auraTouch = await authenticateAuraTouch(token ?? undefined);

            return await handler(request, auraTouch);
        } catch (error) {
            console.log(error);

            if (error instanceof BusinessError) {
                return NextResponse.json({ success: false, message: "Error interno del servidor."}, { status: 500 });
            }
        }
    };
}