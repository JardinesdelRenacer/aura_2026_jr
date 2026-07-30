import { NextRequest } from "next/server";

export function getBearerToken(request: NextRequest) {
    const authorization = request.headers.get("authorization");

    if (!authorization) {
        return null;
    }

    if (!authorization.startsWith("Bearer")) {
        return null;
    } 

    return authorization.replace("Bearer", "").trim();
}