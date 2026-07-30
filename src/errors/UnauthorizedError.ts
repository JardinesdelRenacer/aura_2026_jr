import { BusinessError } from "./BusinessError";

export class UnauthorizedError extends BusinessError {
    constructor(message = "No autorizado.") {
        super(message, 401);
    }
}