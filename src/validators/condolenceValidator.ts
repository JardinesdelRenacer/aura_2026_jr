import { CondolenceDTO } from "@/src/dto/condolence.dto";
import { error } from "console";
import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";

export function validateCondolence(data: CondolenceDTO): void {
    if (!data.fullName.trim()) {
        throw new Error("El nombre es obligatorio.");
    }

    if (!data.documentType.trim()) {
        throw new Error("Debe seleccionar un tipo de documento.");
    }

    if (!data.documentNumber.trim()) {
        throw new Error("El número de documento es obligatorio.");
    }

    if (!data.phone.trim()) {
        throw new Error("El teléfono es obligatorio.");
    }
    
    if (!data.message.trim()) {
        throw new Error("Debe escribir un mensaje.");
    }

    if (data.message.trim().length < 10) {
        throw new ValidationError ("El mensaje debe tener al menos 10 caracteres.");
    }

    if (data.message.trim().length > 1000) {
        throw new ValidationError("El mensaje supera el máximo permitido.");
    }

    if (!data.acceptedTerms) {
        throw new Error("Debe aceptar la politica de privacidad.");
    }

    if (!data.obituaryId.trim()) {
        throw new NotFoundError("No se encontró el obituario.");
    }
}