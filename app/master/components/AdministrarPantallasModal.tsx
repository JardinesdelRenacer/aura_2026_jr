"use client";

import PantallaCard from "./PantallaCard";
import EstadisticaCard from "./EstadisticaCard";
import { useEffect, useState } from "react";
import RegistrarPantallaModal from "./registrarPantallaModal";

interface Props {
    sede: any;
    onClose:()=>void;
    onActualizar: () => void;
}

export default function AdministrarPantallasModal({
    sede,
    onClose,
    onActualizar
}:Props){
    const [showRegistrar, setShowRegistrar] = useState(false);
    
    useEffect(() => {
        if (!sede?.id) return;

        const interval = setInterval(() => {
            onActualizar();
        }, 5000);

        return () => clearInterval(interval);
    }, [sede.id, onActualizar]);
    
    return(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="border-b px-8 py-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black">{sede.nombre}</h2>

                            <p className="text-slate-500">{sede.ciudad} · {sede.departamento}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowRegistrar(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition"
                            >
                                + Registrar Pantalla
                            </button>
                            
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full hover:bg-slate-100 transition"
                            >
                                ✕
                            </button>  
                        </div>       
                    </div>  
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Estadistica */}
                    <div className="grid grid-cols-4 gap-4">
                        <EstadisticaCard
                            titulo="Pantallas"
                            valor={sede.pantallas.length}
                        />

                        <EstadisticaCard
                            titulo="Presentaciones"
                            valor={sede.presentaciones.length}
                        />

                        <EstadisticaCard
                            titulo="Media"
                            valor={sede.media.length}
                        />

                        <EstadisticaCard
                            titulo="Obituarios"
                            valor={sede.obituarios.length}
                        />
                    </div>

                    {/* Pantallas Registradas*/}
                    <h3 className="text-xl font-bold">Pantallas registradas</h3>
                    <div className="space-y-4">
                        {sede.pantallas?.length > 0 ? (
                            sede.pantallas.map((pantalla:any) => (

                            <PantallaCard
                                key={pantalla.id}

                                pantalla={pantalla}
                            />
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                            No hay pantallas registradas.
                        </div>
                    )}
                    </div>
                


              

                </div>
            </div>
            <RegistrarPantallaModal
                open={showRegistrar}
                onClose={() => setShowRegistrar(false)}
                sedeId={sede.id}
                onRegistrada={() => {
                    setShowRegistrar(false);

                    onActualizar();
                }}
            />
        </div>  
    )
}
