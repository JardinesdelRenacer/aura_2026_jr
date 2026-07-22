import { Obituary } from "@/src/types/obituary";

export function mapObituary(api: any): Obituary {
    return {
        id: api.id,
        name: api.name,
        surname: api.surname,
        roomName: api.sala,
        status: api.estado,
        startTime: api.timeStart,
        endTime: api.timeEnd,
        description: api.description ?? "La familia agradece sus palabras de apoyo."
    };
}