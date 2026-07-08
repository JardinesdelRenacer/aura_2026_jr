"use client";

import { Presentacion } from "@prisma/client";
import { useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;

    pantalla: any;
    presentaciones: any[];
    
    onActualizada: () => void;
}

export default function CambiarPresentacionModal({
    open,
    onClose,
    pantalla,
    presentaciones,
    
    onActualizada,
}: Props) {

    
    
    const [seleccionada, setSeleccionada] = useState(
        pantalla.presentacionId
    );

    async function guardar() {
        try {
            const response = await fetch(`/api/master/pantallas/${pantalla.id}`, {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    presentacionId: seleccionada,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                alert(result.error ?? "No se puedo actualizar la presentación");
                return;
            }

            onActualizada();

            onClose();
        } catch (error) {
            console.log(error);

            alert("Error al actualizar la presentacion.");
        }
    }
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999999]">
            <div className="bg-white rounded-3xl w-full max-w-xl p-8">
                <h2 className="text-2xl font-black">Cambiar presentación</h2>

                <div className="mt-8 space-y-3">
                    {presentaciones.map((presentacion) => (
                        <button
                            key={presentacion.id}
                            onClick={() => setSeleccionada(presentacion.id)}
                            className={`w-full rounded 2xl border p-5 text-left transition $(
                                seleccionada === oresentacion.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 hover:border-blue-300"
                            }`}
                        >
                            <h3 className="font-bold">{presentacion.nombre}</h3>

                            <p className="text-sm text-slate-500 mt-1">{presentacion.projectionMode}</p>
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button onClick={onClose} className="px-5 px-3 rounded-xl border">Cancelar</button>

                    <button onClick={guardar} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold">Guardar cambios</button>
                    
                </div>
                
                {/* Boton color negro con letras blancas, sirve el estilo para otra pagina 
                <button onClick={onClose} className="mt-8 bg-slate-900 text-white rounded-xl px-5 py-3">
                    Cerrar
                </button>

                */}
            </div>
        </div>
    );
}