import { Obituary } from "@/src/types/obituary";
import { ObituaryDTO } from "@/src/dto/obituary.dto";

export function mapObituary(api: ObituaryDTO): Obituary {
    return {
        id: api.id,
        name: api.name,
        surname: api.surname,
        roomName: api.sala,
        status: api.estado,
        startTime: api.timeStart,
        endTime: api.timeEnd,
        hideDate: api.endDate,
        hideTime: api.endTime,
        description: api.description ?? "La familia agradece sus palabras de apoyo."
    };
}