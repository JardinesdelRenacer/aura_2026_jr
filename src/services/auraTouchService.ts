import { findAuraRegistrationCode, createAuraTouch, markAuraRegistrationCodeAsUsed } from "@/src/repositories/auraTouchRepository";

import { ValidationError } from "@/src/errors/ValidationError";
import { NotFoundError } from "@/src/errors/NotFoundError";

import { validateAuraTouchRegistration } from "@/src/validators/auraTouchValidator";

interface RegisterAuraTouchData {
    codigo: string;
    nombre: string;
    userAgent?: string;
    ip?: string; 
}

export async function registerAuraToch(data: RegisterAuraTouchData) {

    validateAuraTouchRegistration(data);

    const codigo = data.codigo?.trim();
    const nombre = data.nombre?.trim();

    // Busca el código
    const registrationCode = await findAuraRegistrationCode(codigo);

    if (!registrationCode) {
        throw new NotFoundError(
            "El código de registro no existe."
        );
    }

    // Comprueba que sea un código para Aura Touch
    if (registrationCode.tipoDispositivo !== "AURA_TOUCH") {
        throw new ValidationError(
            "Este código de registro no existe."
        );
    }

    //Comprueba que no haya sido utilizado
    if (registrationCode.usado) {
        throw new ValidationError(
            "Este código de registro ya fue utilizado"
        );
    }

    //Comprueba el tiempo de expiración
    if (registrationCode.expiresAt < new Date()) {
        throw new ValidationError(
            "El código de registro ha expirado."
        );
    }

    // Se crea Aura Touch para el dispostivo
    const auraToch = await createAuraTouch(
        nombre,
        registrationCode.sedeId,
        data.userAgent,
        data.ip
    );

    // Se marca el código como utilizado
    await markAuraRegistrationCodeAsUsed(
        registrationCode.id
    );

    return auraToch;
}