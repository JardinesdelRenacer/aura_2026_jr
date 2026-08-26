"use client";

import { useEffect, useRef } from "react";

import { Clock3, Info } from "lucide-react";

import ObituaryCard from "../components/ObituaryCard";
import { useObituaries } from "@/src/hooks/useObituaries";
import { Obituary } from "@/src/types/obituary";

interface SelectObituaryScreenProps {
    onSelect: (obituary: Obituary) => void;
    onNoServices: () => void;
}

export default function SelectObituaryScreen({
    onSelect,
    onNoServices,
}: SelectObituaryScreenProps) {

    const noServicesReported = useRef(false);

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

    useEffect(() => {
        if (loading || error || obituaries.length > 0) {
            if (obituaries.length > 0) noServicesReported.current = false;
            return;
        }

        if (!noServicesReported.current) {
            noServicesReported.current = true;
            onNoServices();
        }
    }, [error, loading, obituaries.length, onNoServices]);

    console.table(obituaries);

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
            <main className="flex min-h-screen items-center justify-center p-6">
                <section className="w-full max-w-xl rounded-[32px] border border-white/80 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                        <Info size={42} />
                    </div>
                    <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-blue-600">Aura Touch</p>
                    <h1 className="mt-3 text-3xl font-black text-slate-800 sm:text-4xl">No hay servicios disponibles</h1>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600">Por el momento no hay servicios funerarios activos para esta sede.</p>
                    <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        <Clock3 size={17} /> Regresando al inicio…
                    </p>
                </section>
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
