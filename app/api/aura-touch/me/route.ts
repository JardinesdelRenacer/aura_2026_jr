import { NextResponse } from "next/server";

import { withAuraTochAuth } from "@/src/lib/withAuraTouchAuth";

export const GET = withAuraTochAuth(
    async (_request, auraTouch) => {

        return NextResponse.json({ success: true, data: auraTouch });
    }
); 