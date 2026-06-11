import React from "react";

export function TrasladosTab() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Traslados y Control Operativo</h3>
                    <p className="text-sm text-slate-500 mt-1">Gestione el movimiento de obituarios entre diferentes salas y sedes en tiempo real.</p>
                </div>
            </div>

            {/* Panel Principal de Traslado */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="font-bold text-slate-800">Asistente de Traslado</h4>
                    <p className="text-xs text-slate-500 mt-1">Seleccione la sala de origen y el destino para migrar los datos de la pantalla de forma automática.</p>
                </div>
                
                <div className="p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/30">
                    {/* ORIGEN */}
                    <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
                        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-black tracking-widest text-slate-400 uppercase">Origen</div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">Seleccionar Sala Actual</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700 font-medium">
                            <option>Sede Centro - Sala VIP</option>
                            <option>Sede Norte - Sala 1</option>
                            <option>Sede Sur - Sala 2</option>
                        </select>
                        <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 transition-all">
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Obituario Activo</p>
                            <p className="text-sm font-bold text-slate-700">Juan Carlos Pérez Gómez</p>
                            <p className="text-xs text-slate-500 mt-1">Transmitiendo desde: 08:00 AM</p>
                        </div>
                    </div>

                    {/* ICONO CENTRAL */}
                    <div className="hidden md:flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-md border border-slate-200 relative z-10">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        </div>
                    </div>

                    {/* DESTINO */}
                    <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
                        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-black tracking-widest text-slate-400 uppercase">Destino</div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">Seleccionar Nueva Sala</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700 font-medium">
                            <option>Seleccione un destino...</option>
                            <option>Sede Centro - Sala 2</option>
                            <option>Sede Norte - Sala VIP</option>
                        </select>
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-sm font-bold text-slate-600">Sala Disponible para Traslado</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors">Cancelar</button>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        Ejecutar Traslado
                    </button>
                </div>
            </div>

            {/* Historial de Traslados */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h4 className="font-bold text-slate-800">Historial de Movimientos</h4>
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors">Ver historial completo</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                                <th className="p-4 font-bold">Fecha y Hora</th>
                                <th className="p-4 font-bold">Obituario</th>
                                <th className="p-4 font-bold">Origen</th>
                                <th className="p-4 font-bold">Destino</th>
                                <th className="p-4 font-bold">Usuario</th>
                                <th className="p-4 font-bold">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-600">
                            <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 whitespace-nowrap">Hoy, 10:45 AM</td>
                                <td className="p-4 font-bold text-slate-700">María López</td>
                                <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium border border-slate-200 shadow-sm">Sede Sur - Sala 1</span></td>
                                <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium border border-slate-200 shadow-sm">Sede Sur - Sala VIP</span></td>
                                <td className="p-4 text-xs font-medium">admin@aura2026.co</td>
                                <td className="p-4"><span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-md text-[10px] font-black uppercase tracking-wider">Completado</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}