import { NextResponse } from "next/server";
import { withErrorHandling } from "./middlewares/error-handler";

function proxyHandler() {
    return NextResponse.next();
}

export const proxy = withErrorHandling(proxyHandler);

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|imagenes|.*\\..*).*)",
    ],
};
