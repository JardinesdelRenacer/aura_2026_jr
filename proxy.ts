import { NextResponse, type NextRequest } from "next/server";
import { withErrorHandling } from "./middlewares/error-handler";
import { readSession, SESSION_COOKIE } from "./src/lib/auth-session";

async function proxyHandler(request: NextRequest) {
    const session = await readSession(
        request.cookies.get(SESSION_COOKIE)?.value
    );
    const isMaster =
        session?.role === "MASTER" || session?.role === "SUPER_MASTER";
    const isMasterArea =
        request.nextUrl.pathname.startsWith("/master") ||
        request.nextUrl.pathname.startsWith("/api/master/");
    const isProjectionApi = [
        "/api/master/media",
        "/api/master/presentaciones",
        "/api/master/configuracion/",
        "/api/master/obituarios/",
        "/api/master/sedes/",
    ].some((path) => request.nextUrl.pathname.startsWith(path));
    const isScreenPresentationRequest =
        request.method === "GET" &&
        request.nextUrl.pathname.startsWith("/api/master/presentaciones/");

    if (
        isScreenPresentationRequest ||
        (isProjectionApi && session) ||
        (isMasterArea && isMaster) ||
        (!isMasterArea && session)
    ) {
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json(
            { success: false, error: "No autorizado" },
            { status: 401 }
        );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
}

export const proxy = withErrorHandling(proxyHandler);

export const config = {
    matcher: [
        "/master/:path*",
        "/proyectar/:path*",
        "/dashboard/:path*",
        "/api/master/:path*",
    ],
};
