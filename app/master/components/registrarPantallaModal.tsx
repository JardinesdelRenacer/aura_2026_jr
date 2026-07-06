"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

interface Props {
    open: boolean;
    onClose: () => void;
    sedeId: string;

    onRegistrada?: () => void;
}

export default function RegistrarPantallaModal({
    open,
    onClose,
    sedeId,

    onRegistrada,
}: Props) {

    const [codigo, setCodigo] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    

    useEffect(() => {
        if (!open) return;

        setRegistrada(false);
        generarCodigo();
    }, [open]);

    async function generarCodigo() {
        try {
            const response = await fetch("/api/pantalla/generar-codigo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sedeId,
                }),
            });

            const result = await response.json();

            if (!result.success) return;

            setCodigo(result.codigo);
            console.log("Código generado:", result.codigo);
            setExpiresAt(result.expiresAt);

            setSegundos(300);
            iniciarPolling(result.codigo);
            
        } catch (error) {
            console.error(error);
        }
    }

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (open) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [open]);

    function iniciarPolling(codigo: string) {

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        intervalRef.current = setInterval(async () => {

            console.log("Consultando:", codigo);

            const response = await fetch(`/api/pantalla/info?codigo=${codigo}`);

            const result = await response.json();

            console.log(result);

            if (!result.success) return;

            if (!result.registrada) return;

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
           

            setRegistrada(true);

            setTimeout(() => {
                onClose();
                onRegistrada?.();
            }, 1500);

        }, 2000);
    }

    const [segundos, setSegundos] = useState(300);

    const [registrada, setRegistrada] = useState(false);

    const minutos = Math.floor(segundos / 60);

    const segundosRestantes = segundos % 60;

    useEffect(() => {
        if (!open) return;

        if (segundos <= 0) return;

        const timer = setInterval(() => {
            setSegundos((s) => s - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [segundos, open]);

    if(!open) return null;

    return (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="border-b border-slate-200 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black">Registrar Pantalla</h2>

                        <p className="text-slate-500 text-sm">Vincula una nueva pantalla a esta sede.</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>


                {/* Body */}

                {/* Código */}
                <div className="p-8">
                    <p className="text-xs uppercase font-bold text-slate-500">Código</p>

                    <div className="mt-3 rounded-2xl border border-slate-300 bg-slate-100 py-6 text-center">
                        <span className="text-5xl tracking-widset font-black">
                            {codigo || "--- ---"}
                        </span>
                    </div>

                    <p className="text-center font-bold">
                        {expiresAt
                            ? new Date(expiresAt).toLocaleString()
                            : "-"}
                    </p>
                </div>

                {/* QR */}
                <div className="mt-8 flex justify-center">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <QRCode
                            value={`${window.location.origin}/display/registrar?codigo=${codigo}`}
                            size={220}
                        />
                    </div>
                </div>

                <div className="mt-8 rounded-2xl bg-slate-100 border border-slate-200 p-5">

                    {registrada ? (
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="font-semibold text-emerald-700">
                                Pantalla registrada correctamente
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-semibold">
                                Esperando una pantalla...
                            </span>
                        </div>
                    )}
                </div>

                {/* Timer codigo */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        Expira en
                    </p>

                    <p className="text-4xl font-black mt-2">
                        {String(minutos).padStart(2, "0")}:
                        {String(segundosRestantes).padStart(2, "0")}
                    </p>
                </div>

                
                
            </div>
        </div>
    );
}