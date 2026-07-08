"use client";

import { Monitor, Globe, Clock, Wifi, Languages, HardDrive } from "lucide-react";

interface Props {
    pantalla: any,
    onClose: () => void;
}

export default function PantallaDetalleModa({
    pantalla,
    onClose,
}: Props) {
    const ultimaConexion = pantalla.lastSeen
        ? new Date(pantalla.lastSeen)
        : null;

    const navegador = pantalla.userAgent?.includes("Chrome")
        ? "Google Chrome"
        : pantalla.userAgent?.includes("Firefox")
        ? "Mozilla Firefox"
        : pantalla.userAgent?.includes("Edg")
        ? "Microsoft Edge"
        : pantalla.userAgent?.includes("Safari")
        ? "Safari"
        : "Desconocido";
    
    return (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
                
                {/* Header*/}
                <div className="border-b border-slate-200 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black">{pantalla.nombre}</h2>

                        <p className="text-slate-500">Información del dispositivo</p>
                    </div>

                    <button onClick={onClose}
                        className="w-10 h-10 rounded hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 grid grid-cols-2 gap-6">
                    <Info 
                        icon={<Wifi size={18}/>}
                        titulo="Estado"
                        valor={pantalla.online ? "Online" : "Offline"}
                    />

                    <Info
                        icon={<Clock size={18}/>}
                        titulo="Última conexión"
                        valor={ultimaConexion ? ultimaConexion.toLocaleString() : "-"
                        }
                    />

                    <Info 
                        icon={<Monitor size={18}/>}
                        titulo="Resolución"
                        valor={`${pantalla.screenWidth} × ${pantalla.screenHeight}`}
                    />

                    <Info
                        icon={<Clock size={18}/>}
                        titulo="Viewport"
                        valor={`${pantalla.viewportWidth} × ${pantalla.Height}`}
                    />
                    
                    <Info
                        icon={<Globe size={18}/>}
                        titulo="Navegador"
                        valor={navegador}
                    />

                    <Info
                        icon={<Languages size={18}/>}
                        titulo="Idioma"
                        valor={pantalla.languaje ?? "-"}
                    />

                    <Info
                        icon={<HardDrive size={18}/>}
                        titulo="IP"
                        valor={pantalla.ip ?? "-"}
                    />

                    <Info
                        icon={<Monitor size={18}/>}
                        titulo="Presentación"
                        valor={pantalla.presentacion?.nombre ?? "-"}
                    />
                </div>
            </div>
        </div> 
    );
}

function Info({
    icon,
    titulo,
    valor,
}: any) {
    return (
        <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-slate-500">
                {icon}

                <span className="text-sm font-bold">{titulo}</span>
            </div>

            <p className="mt-3 text-lg font-semibold text-slate-800 break-all">{valor}</p>
        </div>
    );
}