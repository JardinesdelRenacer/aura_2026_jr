import { CondolenceDTO } from "@/src/dto/condolence.dto";
import { createCondolence, findActiveObituaryById } from "@/src/repositories/condolenceRepository";
import { generateSequentialCode } from "@/src/utils/codeGenerator";
import { validateCondolence } from "@/src/validators/condolenceValidator";
import { NotFoundError } from "@/src/errors/NotFoundError";

export async function registerCondolence(data: CondolenceDTO) {


    // Valida el formulario
    validateCondolence(data);

    const obituary = await findActiveObituaryById(data.obituaryId);

    console.log("Obituario recibido: ", data.obituaryId);
    console.log("Obituario encontrado: ", obituary);

    // Verifica que el obituario siga disponible
    if (!obituary) {
        throw new NotFoundError("El obituario seleccionado no existe o ya no se encuentra disponible.");
    }
    
    //Genera el código
    const code = await generateSequentialCode("COND");

    // Guarda la condolencia
    return await createCondolence(data, code);   
}