import { CondolenceDTO } from "@/src/dto/condolence.dto";

export async function submitCondolence(form: CondolenceDTO) {

    const response = await fetch("/api/condolencias",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });

    if (!response.ok) {
        throw new Error("No fue posible enviar la condolencia.");
    }

    const result = await response.json();
    
    if (!result.success) {
        throw new Error(result.message ?? "No fue posible registrar la condolencia.");
    }
    return result.data;
}