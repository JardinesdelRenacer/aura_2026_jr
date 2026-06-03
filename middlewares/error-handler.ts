import { NextResponse, type NextProxy, type NextRequest } from "next/server";

export function handleProxyError(error: unknown, request: NextRequest) {
    const message = error instanceof Error ? error.message : "Unexpected proxy error";

    console.error(`[proxy] ${request.nextUrl.pathname}: ${message}`);

    if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }

    const response = NextResponse.next();
    response.headers.set("x-aura-proxy-error", "true");
    return response;
}

export function withErrorHandling(handler: NextProxy): NextProxy {
    return async (request, event) => {
        try {
            return await handler(request, event);
        } catch (error) {
            return handleProxyError(error, request);
        }
    };
}
