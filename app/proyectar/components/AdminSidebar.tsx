"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
    open: boolean;
    onClose: () => void;

    sedeId: string;

    sede?: {
        nombre?: string;
        ciudad?: string;
        departamento?: string;
    } | null;

    user?: {
        email?: string;
        role?: string;
    } | null;

    onLogout?: () => void;
}

export default function AdminSidebar({
    open,
    onClose,
    sedeId,
    sede,
    user,
    onLogout
}: AdminSidebarProps) {
    const router = useRouter();

    useEffect(() => {
        if(!open) return;

        const handleEscape = (event: KeyboardEvent) => {
            if(event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    function navegar(ruta: string) {
        onClose();
        router.push(ruta);
    }

    if(!open) {
        return null;
    }

    return(
        <>
            {/* Overlay */}
            <button type="button" aria-label="Cerrar menú" onClick={onClose} className="fixed inset-0 z-[9998] bg-slate-950/45 backdrop-blur-[2px] animate-in fade-in duration-200" />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-[9999] flex h-screen w-[290px] max-w-[85vw] flex-col border-r border-white/60 bg-white/95 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-left duration-300">

                {/* Header */}
                <div className="border-b border-slate-100 p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">
                                Aura 2026
                            </p>

                            <h2 className="mt-1 truncate text-lg font-black text-slate-800">
                                Jardines del Renacer
                            </h2>

                            <p className="mt-1 truncate text-xs text-slate-500">
                                {user?.email ?? "Administrador"}
                            </p>
                        </div>
                        
                        <button type="button" onClick={onClose} aria-label="Cerrar menú" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:scale-95 ">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main */}
                <div className="px-5 pt-5">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-500">
                            Sede actual
                        </p>

                        <p className="mt-1 font-bold text-slate-800">
                            {sede?.nombre ?? "Sin sede"}
                        </p>

                        {(sede?.ciudad ||
                            sede?.departamento) && (
                            <p className="mt-1 text-xs text-slate-500">
                                {[sede?.ciudad, sede?.departamento].filter(Boolean).join(" · ")}
                            </p>
                        )}
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
                    <button
                        type="button"
                        onClick={() =>
                            navegar(
                                `/proyectar/${sedeId}`
                            )
                        }
                        className="
                            group
                            flex w-full items-center gap-3
                            rounded-2xl
                            border
                            border-blue-100
                            bg-blue-50
                            px-4
                            py-3.5
                            text-left
                            text-sm
                            font-bold
                            text-blue-700
                            transition-all
                            hover:bg-blue-100
                        "
                    >
                        <span
                            className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                                shadow-sm
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 5h16v10H4V5zm4 14h8M12 15v4"
                                />
                            </svg>
                        </span>

                        <div className="min-w-0">
                            <span className="block">
                                Proyección
                            </span>

                            <span className="mt-0.5 block text-[11px] font-medium text-blue-500">
                                Pantallas y salas
                            </span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navegar(
                                `/cenizarios/${sedeId}`
                            )
                        }
                        className="
                            group
                            flex w-full items-center gap-3
                            rounded-2xl
                            border
                            border-transparent
                            px-4
                            py-3.5
                            text-left
                            text-sm
                            font-bold
                            text-slate-700
                            transition-all
                            hover:border-violet-100
                            hover:bg-violet-50
                            hover:text-violet-700
                        "
                    >
                        <span
                            className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-xl
                                bg-violet-100
                                text-violet-600
                                transition-all
                                group-hover:bg-violet-600
                                group-hover:text-white
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 3h14v18H5V3zm3 4h8M8 11h8M8 15h5"
                                />
                            </svg>
                        </span>

                        <div className="min-w-0">
                            <span className="block">
                                Cenizarios
                            </span>

                            <span className="mt-0.5 block text-[11px] font-medium text-slate-400 group-hover:text-violet-500">
                                Memoriales y QR
                            </span>
                        </div>
                    </button>
                </nav>

                {/* Footer */}
                <div className="border-t border-slate-100 p-4">
                    <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Rol
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-slate-700">
                            {user?.role === "ADMIN"
                                ? "Administrador de Sede"
                                : user?.role ??
                                  "Administrador"}
                        </p>
                    </div>

                    {onLogout && (
                        <button
                            type="button"
                            onClick={onLogout}
                            className="
                                flex w-full items-center justify-center gap-2
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                font-bold
                                text-red-600
                                transition
                                hover:bg-red-100
                                active:scale-[0.98]
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 17l5-5-5-5M15 12H3m9-9h6a2 2 0 012 2v14a2 2 0 01-2 2h-6"
                                />
                            </svg>

                            Cerrar sesión
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}