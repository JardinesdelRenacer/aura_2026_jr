import React from "react";
import { useRouter } from "next/navigation";

interface SalasTabProps {
    sedes: any[];
    setShowModalSede: (show: boolean) => void;
    setSedeToEdit: React.Dispatch<React.SetStateAction<any | null>>;
}

export function SalasTab({ sedes, setShowModalSede, setSedeToEdit }: SalasTabProps) {
    const router = useRouter();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Listado de Sedes y Salas</h3>
                <button onClick={() => setShowModalSede(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Crear Nueva Sede
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-sm overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-bold">Sede / Ubicación</th>
                                <th className="p-4 font-bold">Encargado de Sede</th>
                                <th className="p-4 font-bold">Salas y Distribución</th>
                                <th className="p-4 font-bold">Rendimiento (Mes)</th>
                                <th className="p-4 font-bold">Estado</th>
                                <th className="p-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {sedes.length > 0 ? sedes.map((sede, i) => {

                                const ultimaConexion = sede.lastSeen ? new Date(sede.lastSeen) : undefined;

                                let estaTransmitiendo = false;

                                if (ultimaConexion) { estaTransmitiendo = Date.now() - ultimaConexion.getTime() < 15000; }

                                return (
                                    <tr key={sede.id || i} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors group">

                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800">{sede.nombre}</span>
                                                <span className="text-xs text-slate-500">{sede.ciudad}, {sede.departamento}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-inner">
                                                    {sede.admin?.email?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-700">{sede.admin?.nombres ? `${sede.admin.nombres} ${sede.admin.apellidos}` : sede.admin?.email || "Sin asignar"}</span>
                                                    <span className="text-[10px] text-slate-400">Rol: ADMIN</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">
                                                    {sede.numeroSalas} Sala{sede.numeroSalas > 1 ? "s" : ""}
                                                </span>

                                                {sede.salaVip && (
                                                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold border border-amber-200">Módulo VIP</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700">{sede.obituarios?.length || 0} Obituarios</span>
                                                <span className="text-[10px] font-bold text-emerald-500">+ Monitoreo Activo</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${estaTransmitiendo ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>{estaTransmitiendo ? "TRANSMITIENDO" : "INACTIVA"}</span>
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => router.push(`/proyectar/${sede.id}`  )} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm border border-blue-100 text-xs font-bold" title="Administrar Sede">
                                                    Administrar Sede
                                                </button>

                                                {/* 
                                                <button className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-200 rounded-lg transition-all shadow-sm border border-slate-200 text-xs font-bold" title="Configuración">
                                                    Configuración
                                                </button>
                                                */}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                                   No hay sedes registradas en la base de datos. Haga clic en &quot;Crear Nueva Sede&quot; para empezar.
                                </td>
                            </tr>
                        )}   
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}