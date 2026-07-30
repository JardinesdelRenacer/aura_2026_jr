import { ValidationError } from "@/src/errors/ValidationError";
import { RegisterAuraTouchDTO } from "@/src/dto/RegisterAuraTouchDTO";

export function validateAuraTouchRegistration(
    data: RegisterAuraTouchDTO
) {
    if (!data.codigo?.trim()) {
        throw new ValidationError(
            "El código de registro es obligatorio."
        );
    }

    if (!data.nombre?.trim()) {
        throw new ValidationError(
            "El nombre del dispositivo es obligatorio."
        );
    }

    if (data.nombre.trim()) {
        throw new ValidationError(
            "El nombre del dispositivo debe tener al menos 3 caracteres."
        );
    }

    if (data.nombre.trim().length > 80) {
        throw new ValidationError(
            "El nombre del dispositivo no puede superar los 80 caracteres."
        );
    }
}