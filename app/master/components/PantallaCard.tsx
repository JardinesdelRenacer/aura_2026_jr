"use client";

import { Monitor, Globe, Clock, MoreVertical, Eye, Presentation, RefreshCw } from "lucide-react";
import EstadisticaCard from "./EstadisticaCard";
import { useState, useRef, useEffect } from "react";

interface Props {
    pantalla: any;

    onVerDetalles: (pantalla:any) => void;

    //onCambiarNombre?: (pantalla:any) => void;

    onCambiarPresentacion: (pantalla:any) => void;

    onReiniciar: (pantalla:any) => void;

    //onMantenimiento?: (pantalla:any) => void;

    //onEliminar?: (pantalla:any) => void;

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
    onVerDetalles,
    //onCambiarNombre,
    onCambiarPresentacion,
    onReiniciar,
    //onMantenimiento,
    //onEliminar,
}: Props) {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);

    const ultimaConexion = pantalla.lastSeen
        ? new Date(pantalla.lastSeen)
        : null;

    const estaOnline = Boolean(pantalla.online) && Boolean(ultimaConexion) && Date.now() - ultimaConexion!.getTime() < 15000;

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
    
    useEffect(() => {
        const cerrarMenu = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuAbierto(false);
            }
        };

        document.addEventListener("mousedown", cerrarMenu);
        
        return () => {
            document.removeEventListener("mousedown", cerrarMenu);
        };
    }, []);

    const handleVerDetalles = () => {
        setMenuAbierto(false);
        onVerDetalles(pantalla);
    };

    const handleCambiarPresentacion = () => {
        setMenuAbierto(false);
        onCambiarPresentacion
    };

    const handleReiniciar = async () => {
        setMenuAbierto(false);
        await onReiniciar(pantalla);
    };
 
    console.log("PANTALLA");

    console.log({nombre: pantalla.nombre, online: pantalla.online, lastSeen: pantalla.lastSeen, estaOnline});

    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            
            {/* Botón de opciones */}
            <div
                ref={menuRef}
                className="absolute right-5 top-5 z-[100]"
            >
                <button
                    type="button"
                    onClick={() => {
                        setMenuAbierto((prev) => !prev);
                    }}
                    aria-label="Abrir opciones de pantalla"
                    aria-expanded={menuAbierto}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                        menuAbierto
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                >
                    <MoreVertical size={21} />
                </button>

                {menuAbierto && (
                    <div className="absolute right-0 top-full z-[9999] mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                        <button
                            type="button"
                            onClick={handleVerDetalles}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                        >
                            <Eye size={18} />

                            <span>Ver detalles</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                console.log("Abriendo cambio de presentación", pantalla);
                                setMenuAbierto(false);
                                onCambiarPresentacion(pantalla);
                            }}

                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                            <Presentation size={18} />

                            <span>Cambiar presentación</span>
                        </button>

                        <div className="my-1 border-t border-slate-100" />

                        <button
                            type="button"
                            onClick={handleReiniciar}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-700"
                        >
                            <RefreshCw size={18} />

                            <span>Reiniciar contenido</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Información principal */}
            <div className="pr-14">
                <div className="flex flex-col gap-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            {pantalla.nombre}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {pantalla.ip ?? "Sin IP registrada"}
                        </p>
                    </div>

                    <div>
                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${estado.color}`}
                        >
                            {estado.icono} {estado.texto}
                        </span>
                    </div>
                </div>
            </div>

            {/* Datos técnicos */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                        <Monitor size={18} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Resolución
                        </p>

                        <p className="truncate text-sm font-semibold text-slate-700">
                            {pantalla.screenWidth ?? "-"} ×{" "}
                            {pantalla.screenHeight ?? "-"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                        <Globe size={18} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Navegador
                        </p>

                        <p className="truncate text-sm font-semibold text-slate-700">
                            {navegador}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 sm:col-span-2 lg:col-span-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                        <Clock size={18} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Última conexión
                        </p>

                        <p className="truncate text-sm font-semibold text-slate-700">
                            {ultimaConexion
                                ? ultimaConexion.toLocaleString("es-CO")
                                : "Sin conexión registrada"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Presentación */}
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                    Presentación asignada
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                    {pantalla.presentacion?.nombre ??
                        "Sin presentación asignada"}
                </p>
            </div>
        </div>

    );
}

   