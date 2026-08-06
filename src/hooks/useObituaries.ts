"use client";

import { useCallback, useEffect, useState } from "react";

import type { Obituary } from "@/src/types/obituary";
import { getObituaries } from "@/src/services/obituaryApi";

export function useObituaries() {
    const [obituaries, setObituaries] = useState<Obituary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadObituaries = useCallback(
        async (showLoading = false) => {
            try {
                if (showLoading) {
                    setLoading(true);
                }

                setError(null);

                const data = await getObituaries();

                setObituaries(data);
            } catch (error) {
                console.error(
                    "Error cargando obituarios:",
                    error
                );

                setObituaries([]);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Error al conectar con el servidor."
                );
            } finally {
                if (showLoading) {
                    setLoading(false);
                }
            }
        },
        []
    );

    useEffect(() => {
        loadObituaries(true);

        const interval = window.setInterval(() => {
            loadObituaries(false);
        }, 5000);

        return () => {
            window.clearInterval(interval);
        };
    }, [loadObituaries]);

    return {
        obituaries,
        loading,
        error,
        reload: () => loadObituaries(false),
    };
}