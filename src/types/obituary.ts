export interface Obituary{
    id: string;

    name: string;

    surname: string;

    roomName: string;

    status: "ACTIVO" | "FINALIZADO";

    startTime?: string;

    endTime?: string;

    description?: string;
}