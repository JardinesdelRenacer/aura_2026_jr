export interface ObituaryDTO {
    id: string;
    name: string;
    surname: string;
    sala: string;
    estado: "ACTIVO" | "FINALIZADO";
    timeStart: string;
    timeEnd: string;

    description?: string;
}

export interface CondolenceDTO {
    obituaryId: string;
    
    fullName: string;

    documentType: string;

    documentNumber: string;

    phone: string;

    email: string;

    message: string;

    acceptedTerms: boolean;
}