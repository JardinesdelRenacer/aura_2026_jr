import { UnauthorizedError } from "@/src/errors/UnauthorizedError";

import { findAuraTouchByToken, updateLastSeen } from "@/src/repositories/auraTouchRepository";

export async function authenticateAuraTouch(token?: string) {
    if (!token) {
        throw new UnauthorizedError(
            "No se proporcionó el token del dispositivo."
        );
    }
    
    const auraTouch = await findAuraTouchByToken(token);

    if (!auraTouch) {
        throw new UnauthorizedError(
            "Dispositivo no registrado."
        );
    }

    if (!auraTouch) {
        throw new UnauthorizedError(
            "Dispositivo no registrado."
        );
    }

    if (!auraTouch.activo) {
        throw new UnauthorizedError(
            "Este dispositivo fue desactivado."
        );
    }

    await updateLastSeen(auraTouch.id);
    
    return auraTouch;
}