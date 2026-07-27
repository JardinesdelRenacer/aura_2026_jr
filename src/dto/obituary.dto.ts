export interface ObituaryDTO {
    id: string;
    name: string;
    surname: string;
    sala: string;
    estado: "ACTIVO" | "FINALIZADO" | "ARCHIVADO";
    timeStart: string | null;
    timeEnd: string | null;

    endDate: string | null;
    endTime: string | null;

    description?: string;
}

