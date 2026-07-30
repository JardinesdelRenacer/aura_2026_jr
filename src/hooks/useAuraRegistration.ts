"use client";

import { useState } from "react";
import { useRouter } from "next/router";

import { registerAuraTouch, RegisterAuraTouchRequest } from "@/src/api/auraTouchApi";

export function useAuraRegistration() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit(data: RegisterAuraTouchRequest) {
        try {
            setLoading(true);
            setError(null);

            const result = await registerAuraTouch(data);
            
            localStorage.setItem(
                "auraTouchToken",
                result.data.token
            );

            router.replace("/aura-touch");
        } catch (err) {
            setError(
                err instanceof Error 
                ? err.message
                : "Ocurrió un error inesperado."
            );
        } finally {
            setLoading(false);
        }
    }

    return { 
        loading,
        error,
        submit,
    };
}