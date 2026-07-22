"use client";

import ObituaryCard from "../components/ObituaryCard";
import { useObituaries } from "@/src/hooks/useObituaries";
import { Obituary } from "@/src/types/obituary";

interface SelectObituaryScreenProps {
    onSelect: (obituary: Obituary) => void;
}

export default function SelectObituaryScreen({
    onSelect,
}: SelectObituaryScreenProps) {

    // const obituaries: Obituary[] =[
    //     { 
    //         id: "1",
    //         name: "Mushu",
    //         surname: "",
    //         roomName: "Sala VIP",
    //         status: "ACTIVO",
    //         description: "La familia agradece sus palabras de apoyo",
    //     },
    //     {
    //         id: "2",
    //         name: "Mar",
    //         surname: "",
    //         roomName: "Sala 01",
    //         status: "ACTIVO",
    //         description: "Acompaña a la familia con un mensaje.",
    //     },
    // ];
    const { obituaries, loading, error } = useObituaries();

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-2xl text-slate-600">
                    Cargando servicios funerarios...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-2xl text-red-600">{error}</p>
            </main>
        );
    }

    if (obituaries.length === 0) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-2xl text-slate-500">
                    No hay servicios funenarios disponibles.
                </p>
            </main>
        );
    }
    
    return (
        <main className="min-h-screen bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center">
            <div className="min-h-screen bg-white/70 backdrop-blur-sm">
                
                <div className="max-w-7xl mx-auto px-10 py-14">
                    <h1 className="text-5xl font-bold text-center text-slate-800">
                        ¿A quién deseas enviar tu mensaje?
                    </h1>

                    <p className="mt-5 text-center text-xl text-slate-600 max-w-3xl mx-auto">
                        Seleccione el servicio funenario al que desea dirigir sus palabras de apoyo.
                    </p>

                    <div className="mt-14 grid grid-cols-2 gap-8">
                        {obituaries.map((obituary) => (
                            <ObituaryCard key={obituary.id} {...obituary} onSelect={() => onSelect(obituary)}  />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}