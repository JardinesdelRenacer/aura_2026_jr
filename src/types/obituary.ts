export interface Obituary{
    id: string;

    name: string;

    surname: string;

    roomName: string;

    status: "ACTIVO" | "FINALIZADO" | "ARCHIVADO";

    startTime?: string | null;

    endTime?: string | null;

    hideDate?: string | null;

    hideTime?: string | null;

    description?: string;
}