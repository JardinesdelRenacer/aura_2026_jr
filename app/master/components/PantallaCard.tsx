"use client";

import { Monitor, Globe, Clock } from "lucide-react";
import EstadisticaCard from "./EstadisticaCard";
import { useState } from "react";

interface Props {
    pantalla: any;
}

const estados = {
    ONLINE: {
        color: "bg-green-100 text-green-700",
        icono: "🟢",
        texto: "Online",
    },

    OFFLINE: {
        color: "bg-red-100 text-red-700",
        icono: "🔴",
        texto: "Offline",
    },

    MANTENIMIENTO: {
        color: "bg-yellow-100 text-yellow-700",
        icono: "🟡",
        texto: "Mantenimiento",
    },

    ERROR: {
        color: "bg-purple-100 text-purple-700",
        icono: "🟣",
        texto: "Error",
    },
};


export default function PantallaCard({
    pantalla,
}: Props) {
    const ultimaConexion = pantalla.lastSeen
        ? new Date(pantalla.lastSeen)
        : null;

    const estaOnline = pantalla.online && ultimaConexion && Date.now() - ultimaConexion.getTime() < 15000;

    const navegador = pantalla.userAgent?.includes("Chrome")
        ? "Google Chrome"
        : pantalla.userAgent?.includes("Firefox")
        ? "Mozilla Firefox"
        : pantalla.userAgent?.includes("Edg")
        ? "Microsoft Edge"
        : pantalla.userAgent?.includes("Safari")
        ? "Safari"
        : "Desconocido";
    
    
    //const estado = estados[pantalla.estado as keyof typeof estados] ?? estados.OFFLINE;

    const estado = pantalla.estado === "MANTENIMIENTO"
        ? estados.MANTENIMIENTO
        : pantalla.estado === "ERROR"
        ? estados.ERROR
        : estaOnline
        ? estados.ONLINE
        : estados.OFFLINE;

    console.log("PANTALLA");

    console.log({nombre: pantalla.nombre, online: pantalla.online, lastSeen: pantalla.lastSeen, estaOnline});

    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{pantalla.nombre}</h3>

                    <p className="text-sm text-slate-500">
                        {pantalla.ip ?? "Sin Ip"}
                    </p>

                    <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${estado.color}`}>
                            {estado.icono} {estado.texto}
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="w-9 h-9 rounded-full hover:bg-slate-100 transition"
                        >
                            ⋮
                        </button>

                        {menuAbierto && (
                            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50">
                                    👁 Ver detalles
                                </button>

                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50">
                                    ✏️ Cambiar nombre
                                </button>

                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50">
                                    📺 Cambiar presentación
                                </button>
                                
                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50">
                                    🔄 Reiniciar contenido
                                </button>

                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50">
                                    🟡 Mantenimiento
                                </button>

                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50">
                                    🗑 Eliminar pantalla
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center gap-2">
                        <Monitor size={18} />
                        <span className="text-sm">
                            {pantalla.screenWidth ?? "-"} × {pantalla.screenHeight}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Globe size={18} />
                        <span className="text-sm">{navegador}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={18} />
                        <span className="text-sm">{ultimaConexion ? ultimaConexion.toLocaleString() : "."}</span>

                    </div>
                </div>

                {/* Presentacion */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                    <p className="text-xs uppercase text-slate-500 font-bold">Presentación</p>

                    <p className="mt-1 font-semibold text-slate-700">{pantalla.presentacion?.nombre ?? "Sin presentación"}</p>
                </div>
            </div>
        </div>
    );
}