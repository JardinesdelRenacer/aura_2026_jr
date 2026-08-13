"use client";

import { PantallaEscalada } from "./PantallaEscalada";

interface Props {
    sede: any;
    setExpandedSede: (sede: any) => void;
    setPantallaDetalle: (sede: any) => void;
    setAdministrarPantallasModal: (sede: any) => void;
    onRegistrarAuraTouch: (sede: any) => void;
}

export default function DashboardMonitorCard({
    sede,
    setExpandedSede,
    setPantallaDetalle,
    setAdministrarPantallasModal,
    onRegistrarAuraTouch
}: Props) {

    //const pantalla = sede.pantallas?.[0];

    const pantalla = sede.pantallas?.find((p: any) => {
        if (!p.online) return false;

        if(!p.lastSeen) return false;

        return Date.now() - new Date(p.lastSeen).getTime() < 15000;
    });

    const presentacion = pantalla?.presentacion;

    const ultimaConexion = pantalla?.lastSeen
        ? new Date(pantalla.lastSeen)
        : null;

    const estaTransmitiendo =
        pantalla?.estado && ultimaConexion && Date.now() - ultimaConexion.getTime() < 15000;

    const puedeTransmitir =
        estaTransmitiendo && !!presentacion;
    const tabletasEnLinea = (sede.auraTouches ?? []).filter((tableta: any) =>
        tableta.activo &&
        tableta.lastSeen &&
        Date.now() - new Date(tableta.lastSeen).getTime() < 15000
    );

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-bold text-slate-800">{sede.nombre}</h3>
                    <p className="text-xs text-slate-500 font-medium">{sede.admin ? `${sede.admin.nombres} ${sede.admin.apellidos}` : "Sin administrador"}</p>
                </div>

                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${estaTransmitiendo ? "bg-green-50 text-green-600 border-green-200" : tabletasEnLinea.length > 0 ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                    {estaTransmitiendo ? (presentacion ? "Transmitiendo" : "Sin presentación") : tabletasEnLinea.length > 0 ? "Aura Touch en línea" : "Sin conexión"}
                </span>
            </div>

            <div className={`mb-4 flex items-center justify-between rounded-xl border px-3 py-2 text-xs ${tabletasEnLinea.length > 0 ? "border-violet-100 bg-violet-50 text-violet-800" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                <span className="font-semibold">Tabletas Aura Touch</span>
                <span className="font-black">{tabletasEnLinea.length > 0 ? `${tabletasEnLinea.length} en línea` : "Sin tabletas activas"}</span>
            </div>

            {/* Monitor */}
            <div 
                className={`w-full aspect-video bg-slate-900 rounded-lg overflow-hidden relative border border-slate-800 shadow-inner ${puedeTransmitir ? "cursor-pointer group-hover:ring-4 ring-blue-500/20 transition-all group/screen" : "flex items-center justify-center"}`}
                onClick={() => { if(puedeTransmitir) setExpandedSede(sede); }}
            >
                {puedeTransmitir ? (
                    <>
                        <PantallaEscalada 
                            presentacionId={presentacion.id}/>
                        <div className="absolute inset-0 z-10 bg-black/0 group-hover/screen:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover/screen:opacity-100 transition-opacity backdrop-blur-sm">Ampliar Monitor</span>
                        </div>
                        <div className="absolute top-2 right-2 bg-red-500 animate-pulse w-2 h-2 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] z-20" title="En Directo"></div>
                    </>
                ) : (
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-red-400">{tabletasEnLinea.length > 0 ? "Aura Touch activa · pantalla de proyección pendiente" : "Pantalla de proyección sin conexión"}</p>
                )}
            </div>
            {/* Botones */}
            
            {/* <button onClick={() => setPantallaDetalle(sede)} className="mt-4 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold py-2 rounded-lg text-xs transition-colors border border-slate-200 shadow-sm w-full">
                Ver Detalles
            </button>

            <button onClick={() => setAdministrarPantallasModal(sede)} className="mt-4 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold py-2 rounded-lg text-xs transition-colors border border-slate-200 shadow-sm w-full">
                Ver Detalles Admin test
            </button> */}

            {/* btones */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setPantallaDetalle(sede)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                    Ver detalles
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setAdministrarPantallasModal(sede)
                    }
                    className="w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-bold text-blue-700 shadow-sm transition-colors hover:bg-blue-100"
                >
                    Administrar pantallas
                </button>
            </div>

            <button
                type="button"
                onClick={() =>
                    onRegistrarAuraTouch(sede)
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 py-2.5 text-xs font-bold text-violet-700 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-100"
            >
                Registrar tableta Aura Touch
            </button>
        </div>
    );
}
