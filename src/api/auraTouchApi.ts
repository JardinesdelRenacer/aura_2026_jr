export interface RegisterAuraTouchRequest {
    codigo: string;
    nombre: string;
}

export interface RegisterAuraTouchResponse {
    success: boolean;
    data: {
        id: string;
        nombre: string;
        token: string;
        sedeId: string;
    };
    message?: string;
}

export async function registerAuraTouch(payload: RegisterAuraTouchRequest): Promise<RegisterAuraTouchResponse> {
    const response = await fetch("/api/aura-touch/register", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Error al registrar el dispositivo")
    }
    
    return result;
}