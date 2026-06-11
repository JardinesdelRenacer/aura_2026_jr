import React from "react";

export function ConfiguracionTab() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Configuración del Sistema</h3>
                    <p className="text-sm text-slate-500 mt-1">Administre los parámetros globales, apariencia y preferencias operativas de Aura.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Guardar Cambios
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Branding y Apariencia */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                            Apariencia y Marca
                        </h4>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Nombre de la Organización</label>
                            <input type="text" defaultValue="Jardines del Renacer" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">Color Primario</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" defaultValue="#2563EB" className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                                    <span className="text-sm text-slate-600 font-medium">#2563EB</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">Logotipo Oficial</label>
                                <button className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">Actualizar Logo</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Parámetros de Transmisión */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Parámetros de Pantallas
                        </h4>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">Tiempo Base (Fotos)</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700">
                                    <option>10 Segundos</option>
                                    <option>15 Segundos</option>
                                    <option>30 Segundos</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">Transición Global</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700">
                                    <option>Difuminado (Fade)</option>
                                    <option>Deslizamiento (Slide)</option>
                                    <option>Zoom Suave</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 flex justify-between">Intervalo de Refresco <span>10s</span></label>
                            <input type="range" min="5" max="60" defaultValue="10" className="w-full accent-blue-600" />
                            <p className="text-[10px] text-slate-400 mt-1">Tiempo que tardan las pantallas en leer la base de datos.</p>
                        </div>
                    </div>
                </div>

                {/* Preferencias del Sistema Avanzadas */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37 2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Opciones Avanzadas
                        </h4>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { title: "Alertas por Desconexión", desc: "Enviar email si una sede se apaga." },
                                { title: "Modo Estricto", desc: "Requerir 2FA para administradores." },
                                { title: "Auto-limpieza de Caché", desc: "Limpiar multimedia cada 24h." }
                            ].map((opt, i) => (
                                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center mt-0.5">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{opt.title}</span>
                                        <span className="block text-xs text-slate-500 mt-0.5">{opt.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}