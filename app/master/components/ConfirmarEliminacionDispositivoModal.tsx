"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface Props {
    open: boolean;
    tipo: "pantalla" | "tableta";
    nombre: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmarEliminacionDispositivoModal({
    open,
    tipo,
    nombre,
    loading = false,
    onCancel,
    onConfirm,
}: Props) {
    if (!open) return null;

    const etiqueta = tipo === "pantalla" ? "pantalla" : "tableta Aura Touch";

    return (
        <div
            className="fixed inset-0 z-[1000001] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-eliminacion-titulo"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) onCancel();
            }}
        >
            <section className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-2xl shadow-slate-950/30">
                <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5 sm:px-7">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <AlertTriangle size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">Acción irreversible</p>
                        <h2 id="confirmar-eliminacion-titulo" className="mt-1 text-xl font-black text-slate-900">
                            ¿Eliminar {etiqueta}?
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        aria-label="Cancelar eliminación"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="px-6 py-6 sm:px-7">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800">
                        {nombre}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                        El equipo dejará de estar vinculado y deberá registrarse de nuevo con un código nuevo. Los obituarios y la información de la sede no se eliminan.
                    </p>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-7">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700 disabled:cursor-wait disabled:bg-red-300"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        {loading ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                </div>
            </section>
        </div>
    );
}
