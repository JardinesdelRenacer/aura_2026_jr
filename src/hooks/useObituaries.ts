"use client";

import { useCallback, useEffect, useState } from "react";
import { Obituary } from "@/src/types/obituary";
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
            } catch (err) {
                console.error(err);

                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error al conectar con el servidor.");
                }
            } finally {
                if (showLoading) {
                    setLoading(false);
                }
            }  
        },
        []
    );

    useEffect(() => {
        //Primera carga
        loadObituaries(true);

        //Actuliza automaticamente
        const interval = setInterval(() => {
            loadObituaries(false);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [loadObituaries]);

    return {
        obituaries,
        loading,
        error,
        reload: () => loadObituaries(false),
    };
}