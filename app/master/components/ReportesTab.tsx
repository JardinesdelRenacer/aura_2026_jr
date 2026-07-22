import { useDashboard } from "@/src/hooks/useDashboard";
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Datos simulados para la gráfica
const data = [
    { name: "Ene", obituarios: 40 },
    { name: "Feb", obituarios: 70 },
    { name: "Mar", obituarios: 45 },
    { name: "Abr", obituarios: 90 },
    { name: "May", obituarios: 65 },
    { name: "Jun", obituarios: 85 },
];

export function ReportesTab() {

    const{ dashboard, loading, error }=useDashboard();

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (loading) {
        return <div>Cargando dashboard...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboard) {
        return <div>No hay información.</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Reportes y Analíticas</h3>
                    <p className="text-sm text-slate-500 mt-1">Métricas de rendimiento y uso del sistema en todas las sedes.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Filtrar
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Exportar Informe
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Obituarios</p>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+15%</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">{dashboard.summary.totalObituaries}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-2">Últimos 30 días</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Pantallas</p>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+5%</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">{dashboard.summary.totalScreens}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-2">Pantallas registradas</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sede Más Activa</p>
                    </div>
                    <h3 className="text-xl font-black text-blue-700 truncate">{dashboard.topBranches[0]?.nombre ?? "Sin datos"}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-2">{dashboard.topBranches[0]?.totalObituaries ?? 0} obituarios</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pantallas Online</p>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Óptimo</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">{dashboard.summary.onlineScreens}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-2">Pantallas conectadas</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico Recharts */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-slate-800">Tendencia de Publicaciones</h4>
                        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-blue-400">
                            <option>Últimos 6 meses</option>
                            <option>Este año</option>
                        </select>
                    </div>
                    <div className="flex-1 w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }} />
                                <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="obituarios" radius={[6, 6, 0, 0]} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={activeIndex === index ? '#2563EB' : '#93C5FD'} className="transition-colors duration-300" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lista de Rendimiento */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <h4 className="font-bold text-slate-800 mb-6">Rendimiento por Sede</h4>
                    <div className="flex flex-col gap-4">
                        {dashboard.topBranches.map((branch) => {
                            
                            // const totalObituarios = sede.obituarios?.length ?? 0;
                            // const totalPantallas = sede.pantallas?.length ?? 0;

                            const porcentaje = Math.min(Math.max(branch.totalObituaries * 10, 10), 100);

                            // const activa = sede.estado === "ACTIVA";

                            return (
                                <div key={branch.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">

                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 text-sm">{branch.nombre}</span>
                                        <span className="text-[10px] font-semibold text-slate-400">{branch.ciudad} • {branch.departamento}</span>
                                        <span className="text-xs font-bold text-blue-700">{branch.totalObituaries} obituarios</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-blue-700">{branch.totalObituaries} obituarios</span>
                                        {/* <span className={`text-xs font-bold px-2 py-1 rounded-full ${activa ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>{sede.estado}</span> */}

                                        {/* <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden"> */}
                                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">    
                                            <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${porcentaje}%`}} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
               
                    <button className="mt-auto pt-4 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors w-full text-center">Ver reporte completo →</button>
                </div>
            </div>
        </div>
    );
}