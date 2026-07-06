import React from "react";
import { PantallaEscalada } from "./PantallaEscalada";
import DashboardMonitorCard from "./DashboardMonitorCard";

interface DashboardTabProps {
    mockSedes: any[];
    setExpandedSede: (sede: any) => void;
    setPantallaDetalle: (sede:any) => void;
    setAdministrarPantallasModal: (sede:any) => void;
}

export function DashboardTab({ mockSedes, setExpandedSede, setPantallaDetalle, setAdministrarPantallasModal }: DashboardTabProps) {
    const sedesActivas = mockSedes.filter((sede) => {

        if (!sede.lastSeen) return false;
        return (
            Date.now() - new Date(sede.lastSeen).getTime() < 15000
        );
    }).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tarjetas de Resumen (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+2 activas</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">{sedesActivas}</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">Sedes transmitiendo hoy</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">General</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">452</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">Obituarios procesados este mes</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Óptimo</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">18%</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">Carga promedio de servidores</p>
                </div>
            </div>

            {/* Monitoreo Visual en Vivo */}
            <h3 className="text-lg font-bold text-slate-800 mb-2 mt-8">Monitoreo de Pantallas en Tiempo Real</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSedes.map((sede) => (
                    <DashboardMonitorCard
                        key={sede.id}
                        sede={sede}
                        setExpandedSede={setExpandedSede}
                        setPantallaDetalle={setPantallaDetalle}
                        setAdministrarPantallasModal={setAdministrarPantallasModal}
                    />
                ))}             
                {/*
                {mockSedes.map((sede) => {
                    const ultimaConexion = sede.lastSeen ? new Date(sede.lastSeen) : null;
                    const estaTransmitiendo = Boolean(ultimaConexion) && Date.now() - ultimaConexion.getTime() < 15000;

                    const presentacion = sede.presentaciones?.[0];
                    const puedeTransmitir = estaTransmitiendo && !!presentacion;
                    
                    
                    return(
                        <div key={sede.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all">
                           
                            
                            
                        
                    );
                })}
                */}
            </div>
        </div>
    );
}