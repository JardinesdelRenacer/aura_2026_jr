"use client";

import { useEffect, useState } from "react";
import QRcode from "react-qr-code";

interface Props {
    open: boolean;
    onClose: () => void;
    sedeId: string;
}

export default function RegistrarPantallaModal({ 
    open, 
    onClose, 
    sedeId
}: Props) {

    const [codigo, setCodigo] = useState("");
    
    const [expiracion, setExpiracion] = useState("");

    const [loading, setLoading] = useState(false);

    const [copiado, setCopiado] = useState(false);

    const CargarCodigo = async () => {
        setLoading(true);

        try {
            const response = await fetch("/api/pantalla/generar-codigo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sedeId })
            });

            const result = await response.json();

            if (!result.success) return alert("Error al generar código: " + result.error);

            setCodigo(result.codigo);
            setExpiracion(result.expiresAt);
        } catch (error) {
            console.error("Error al cargar el código:", error);
        } finally {
            setLoading(false);
        }
    };

    const url = typeof window !== "undefined" ? `${window.location.origin}/Pantalla/registrar?codigo=${codigo}` : "";

    const copiar = async () => {
        await navigator.clipboard.writeText(url);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    }

    useEffect(() => {
        if (!presentacionId) return;

        cargarPresentacion();

        const interval = setInterval(() => {
            cargarPresentacion();
        }, 3000);

        return () => clearInterval(interval);
    }, [presentacion]);
    
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">

            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-slate-200 overflow-hidden">

                {/* HEADER */}
                <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center">

                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Registrar Pantalla</h2>

                        <p className="text-sm text-slate-500 mt-1">Vincule un nuevo televisor a esta sede.</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-slate-100 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* BODY */}
                <div className="p-8 flex flex-col items-center">
                    <p className="text-slate-500 text-center mb-6">
                        Escanee este codigo QR desde el televisor

                        <br />
                        o escriba el código de manualmente.
                    </p>

                    <div className="bg-white p-5 rounded-2xl shadow border">
                        <QRcode
                            value={url}
                            size={220}
                        />
                    </div>

                    <div className="mt-8">
                        <p className="text-xs uppercase tracking-widest text-slate-500 text-center">Código de registro</p>

                        <h1 className="mt-2 text-5xl font-black tracking-[0.25em] text-slate-800">{codigo}</h1>
                    </div>

                    <div className="mt-8 w-full rounded-2xl bg-slate-100 p-5">
                        <p className="text-xs uppercase font-bold text-slate-500">Enlace de registro</p>

                        <input value={url} readOnly className="mt-2 w-full rounded-xl border bg-white px-4 py-3" />
                    </div>
                </div>

                <div className="mt-8 w-full flex gap-4">
                    <button
                        onClick={copiar}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl"
                    >
                        {copiado ? "Copiado!" : "Copiar Enlace"}
                    </button>

                    <button
                        onClick={CargarCodigo}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl"
                    >
                        {loading ? "Generando..." : "Generar Nuevo Código"}
                    </button>
                </div>
            </div>
        </div>
    );
}