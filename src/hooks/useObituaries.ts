"use client";

import { useCallback, useEffect, useState } from "react";
import { Obituary } from "@/src/types/obituary";
import { mapObituary } from "../services/obituaryMapper";
import { getObituaries } from "@/src/services/obituaryApi";

interface ObituariesResponse {
    success: boolean;
    data: any[];
}

export function useObituaries() {
    const [obituaries, setObituaries] = useState<Obituary[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const loadObituaries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const obituaries = await getObituaries();
            setObituaries(obituaries);
            
            const response = await fetch("/api/obituarios");

            if (!response.ok) {
                throw new Error("No fue posible conectar con el servidor");
            }

            const result: ObituariesResponse = await response.json();

            if (result.success) {
                setObituaries(result.data.map(mapObituary));
            } else {
                setError("No fue posible cargar los obituarios.");
            }
        } catch (err) {
            console.error(err);
            setError("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadObituaries();
    }, [loadObituaries]);

    return {
        obituaries,
        loading,
        error,
        reload: loadObituaries,
    };
}