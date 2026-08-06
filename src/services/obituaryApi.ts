import type { Obituary } from "@/src/types/obituary";

interface ObituariesResponse {
    success: boolean;
    data?: Obituary[];
    error?: string;
}

export async function getObituaries(): Promise<Obituary[]> {
    const response = await fetch(
        "/api/aura-touch/obituarios",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        }
    );

    const result =
        (await response.json()) as ObituariesResponse;

    if (!response.ok || !result.success) {
        throw new Error(
            result.error ??
                "No fue posible obtener los servicios funerarios."
        );
    }

    return Array.isArray(result.data)
        ? result.data
        : [];
}