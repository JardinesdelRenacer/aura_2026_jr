import { Obituary } from "@/src/types/obituary";
import { ObituaryDTO } from "@/src/dto/obituary.dto";
import { mapObituary } from "./obituaryMapper";

interface ApiResponse {
    success: boolean;
    data: ObituaryDTO[];
}

export async function getObituaries(): Promise<Obituary[]> {
    const response = await fetch("/api/obituarios");

    if (!response.ok) {
        throw new Error("No fue posible consultar el servidor.");
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
        throw new Error("No fue posible cargar los obituarios.");
    }

    return result.data.map(mapObituary);
}