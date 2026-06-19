import React from "react";

interface ConfiguracionTabProps {
    projectionMode: string;
    setProjectionMode: (value: string) => void;
    autoPlay: boolean;
    setAutoplay: (value: boolean) => void;
    seconds: number;
    setSeconds: (value: number) => void;
    transitionEffect: string;
    setTransitionEffect: (value: string) => void;
    selectedImage: number;
    setSelectedImage: (value: number) => void;
    files: File[];
}

export default function ConfiguracionTab({
    projectionMode, setProjectionMode,
    autoPlay, setAutoplay,
    seconds, setSeconds,
    transitionEffect, setTransitionEffect,
    selectedImage, setSelectedImage,
    files
}: ConfiguracionTabProps) {
    return (
        <div className="w-full space-y-6 bg-white/50 p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg animate-in fade-in duration-500">
            <h2 className="text-2xl font-black border-b-2 border-slate-200/60 pb-4 text-slate-800 text-center tracking-wide">⚙️ Ajustes de Proyección</h2>
            <div className="flex flex-wrap justify-center items-stretch gap-5 mt-8">
                
                <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                    <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Diseño Pantalla</label>
                    <select value={projectionMode} onChange={(e) => setProjectionMode(e.target.value)} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                        <option value="classic" className="text-black font-medium">Clásico (Alternado)</option>
                        <option value="split" className="text-black font-medium">Dividida (L + Publ.)</option>
                    </select>
                </div>

                <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                    <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Visualización</label>
                    <select value={autoPlay ? "auto" : "fixed"} onChange={(e) => setAutoplay(e.target.value === "auto")} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                        <option value="fixed" className="text-black font-medium">Imagen Fija</option>
                        <option value="auto" className="text-black font-medium">Automática</option>
                    </select>
                </div>

                <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                    <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Tiempo (Segundos)</label>
                    <input type="number" min={1} max={30} value={seconds} onChange={(e) => setSeconds(Math.min(30, Math.max(1, Number(e.target.value))))} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-blue-600 font-black outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-lg shadow-inner" />
                </div>

                <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                    <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Transición</label>
                    <select value={transitionEffect} onChange={(e) => setTransitionEffect(e.target.value)} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                        <option value="fade" className="text-black font-medium">Difuminado</option>
                        <option value="slide" className="text-black font-medium">Deslizamiento</option>
                        <option value="zoom" className="text-black font-medium">Acercamiento</option>
                        <option value="blur" className="text-black font-medium">Enfoque (Blur)</option>
                        <option value="flip" className="text-black font-medium">Giro 3D</option>
                        <option value="none" className="text-black font-medium">Ninguno</option>
                    </select>
                </div>

                {!autoPlay && (
                    <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                        <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Mostrar Imagen</label>
                        <select value={selectedImage} onChange={(e) => setSelectedImage(Number(e.target.value))} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                            {files.map((file, index) => (
                                <option key={index} value={index} className="text-black font-medium">{file.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}