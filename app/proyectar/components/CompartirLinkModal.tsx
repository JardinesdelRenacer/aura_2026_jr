"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

interface Props {
    open: boolean;
    onClose: () => void;
    presentacionId: string;
}

export default function CompartirLinkModal({
    open,
    onClose,
    presentacionId,
}: Props) {

    const [url, setUrl] = useState("");

    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const protocol = window.location.protocol;
        const host = window.location.host;

        setUrl(`${protocol}//${host}/display/${presentacionId}`);
    }, [presentacionId]);
    
    if (!open) return null;

    const copiar = async () => {
        await navigator.clipboard.writeText(url);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">

            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center">

                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Compartir Pantalla</h2>

                        <p className="text-sm text-slate-500 mt-1">Comparte esta presentación con cualquier dispositivo.</p>

                    </div>

                    <button onClick={onClose}
                        className="text-slate-500 hover:text-red-500 transition">
                            X
                    </button>
                </div>

                {/* QR Code */}
                <div className="p-8 space-y-8">
                    <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-xl shadow border">
                            <QRCode
                                value={url}
                                size={220}
                            />
                        </div>
                    </div>

                    {/* Enlace de la presentación */}
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500">
                            Enlace
                        </label>

                        <input
                            value={url}
                            readOnly
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
                        />
                    </div>

                    {/* Información del servidor */}
                    <div className="rounded 2xl border border-slate-200 bg-slate-50 p-5 space-y-2">

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-700">Estado</span>
                            <span className="flex items-center gap-2 text-green-600 font-bold">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                Disponible
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-500">Tipo</span>    
                            <span className="font-bold text-slate-700">{window.location.hostname === "localhost" ? "Servidor Local" : "Red Local"}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-500">Host</span>
                            <span className="font-bold text-slate-700">{window.location.hostname}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-500">Puerto</span>
                            <span className="font-bold text-slate-700">{window.location.port || "80"}</span>
                        </div>
                    
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                        <h3 className="text-sm uppercase tracking-widest font-black text-slate-500">Compartir rápidamente</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={copiar}
                                className={`rounded-xl p-4 transition-all shadow-sm border ${copiado ? "bg-green-600 text-white border-green-600" : "bg-white hover:bg-blue-50 border-slate-200"} `}
                            >
                                <div className="text 3xl mb-2">
                                    {copiado ? "✅" : "📋"}
                                </div>

                                <p className="font-bold">
                                    {copiado ? " Copiado" : " Copiar Link"}
                                </p>
                            </button>

                            <button
                                onClick={() => window.open(url, "_blank")}
                                className="rounded-xl p-4 bg-white hover:bg-emerald-50 border border-slate-200 transition-all shadow-sm"
                            >
                                <div className="text 3xl mb-2">
                                    🌐
                                </div>

                                <p className="font-bold">
                                    Abrir en Navegador
                                </p>
                            </button>

                            <button
                                onClick={() => {
                                    const mensaje = `Visualizar pantalla Aura:\n\n${url}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, "_blank");
                                }}
                                className="rounded-xl p-4 bg-white hover:bg-blue-50 border border-slate-200 transition-all shadow-sm"
                            >
                                <div className="text 3xl mb-2">
                                    📱
                                </div>

                                <p className="font-bold">
                                    Enviar por WhatsApp
                                </p>
                            </button>

                            <button
                                onClick={() => {
                                    const asunto = "Visualizar pantalla Aura";
                                    const mensaje = `Visualizar pantalla Aura:\n\n${url}`;
                                    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`, "_blank");
                                }}
                                className="rounded-xl p-4 bg-white hover:bg-purple-50 border border-slate-200 transition-all shadow-sm"
                            >
                                <div className="text 3xl mb-2">
                                    📧
                                </div>

                                <p className="font-bold">
                                    Enviar por Correo
                                </p>
                            </button>

                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={copiar}
                            className={`flex-1 font-bold py-3 rounded-xl transition-all duration-300 ${copiado ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} `}
                        >
                            {copiado ? "✅ Copiado" : "📋 Copiar Link"}
                        </button>

                        <button
                            onClick={() => window.open(url, "_blank")}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition"
                        >
                            🌐 Abrir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

