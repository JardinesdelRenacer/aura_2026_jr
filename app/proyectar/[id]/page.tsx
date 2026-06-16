"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Proyectar() {
    const params = useParams();
    const sedeId = params.id as string;

    const [ sede, setSede ] = useState<any>(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (!sedeId) return;
        
        const cargarSede = async () => {
            try {
                const resp = await fetch(`/api/sedes/${sedeId}`);
                const data = await resp.json();

                if (data.ok) {
                    setSede(data.sede);
                }
            } catch (error) {
                console.error("Error cargando sede: ", error);
            } finally {
                setLoading(false);
            }
        };
        cargarSede();
    }, [sedeId]);
    
    if (loading) {
        return <div>Cargando sede...</div>;
    }

    if (!sede) {
        return <div>Sede no encontrada.</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">{sede.nombre}</h1>

            <div className="space-y-2">
                <p>
                    <strong>ID:</strong> {sede.id}
                </p>

                <p>
                    <strong>Departamento:</strong> {sede.departamento}
                </p>

                <p>
                    <strong>Salas:</strong> {sede.numeroSalas}
                </p>

                
            </div>
        </div>
    )
}