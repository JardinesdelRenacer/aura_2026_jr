import { CondolenceDTO } from "@/src/dto/condolence.dto";
import { createCondolence } from "@/src/repositories/condolenceRepository";
import { generateSequentialCode } from "@/src/utils/codeGenerator";
import { validateCondolence } from "@/src/validators/condolenceValidator";
import { findObituaryById } from "@/src/repositories/obituaryRepository";

export async function registerCondolence(data: CondolenceDTO) {

    validateCondolence(data);

    const obituary = await findObituaryById(data.obituaryId);

    if (!obituary) {
        throw new Error("El obituario seleccionado no existe.");
    }
    
    const code = await generateSequentialCode("COND");

    return await createCondolence(data, code);   
}