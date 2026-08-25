"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface CenizarioItem {
    id: string;
    publicId: string;
    nombreCompleto: string;
    documento: string;
    fechaNacimiento?: string | null;
    fechaFallecimiento?: string | null;
    mensajeFamiliar?: string | null;
    estado: string;
}

export default function CenizariosPage() {
    const params = useParams();
    const router = useRouter();

    const sedeId = params.sedeId as string;

    const [search, setSearch] = useState("");

    /*
     * Por ahora vacío.
     * Luego estos datos vendrán de:
     *
     * GET /api/cenizarios?sedeId=...
     */
    const [cenizarios] = useState<CenizarioItem[]>([]);

    const cenizariosFiltrados = useMemo(() => {
        const texto = search
            .trim()
            .toLowerCase();

        if (!texto) {
            return cenizarios;
        }

        return cenizarios.filter((cenizario) => {
            return (
                cenizario.nombreCompleto
                    .toLowerCase()
                    .includes(texto) ||
                cenizario.documento
                    .toLowerCase()
                    .includes(texto)
            );
        });
    }, [cenizarios, search]);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">
                            Aura 2026
                        </p>

                        <h1 className="mt-1 text-2xl font-black text-slate-800">
                            Cenizarios
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Administración de memoriales digitales y códigos QR.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/proyectar/${sedeId}`
                                )
                            }
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                        >
                            Volver a Proyección
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/cenizarios/${sedeId}/crear`
                                )
                            }
                            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-violet-700 hover:shadow-lg"
                        >
                            + Crear Cenizario
                        </button>
                    </div>
                </header>

                {/* Buscador */}
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                            />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Buscar por nombre o C.C..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />
                    </div>
                </section>

                {/* Contenido */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="font-bold text-slate-800">
                                    Memoriales registrados
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    {cenizariosFiltrados.length} registros encontrados
                                </p>
                            </div>
                        </div>
                    </div>

                    {cenizariosFiltrados.length === 0 ? (
                        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                                <svg
                                    className="h-8 w-8"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 3h14v18H5V3zm3 4h8M8 11h8M8 15h5"
                                    />
                                </svg>
                            </div>

                            <h3 className="mt-5 text-lg font-black text-slate-800">
                                No hay cenizarios registrados
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                                Cree el primer memorial digital de esta sede para posteriormente generar su código QR.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/cenizarios/${sedeId}/crear`
                                    )
                                }
                                className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                            >
                                Crear primer cenizario
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {cenizariosFiltrados.map(
                                (cenizario) => (
                                    <article
                                        key={cenizario.id}
                                        className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <h3 className="font-black text-slate-800">
                                                {cenizario.nombreCompleto}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                C.C. {cenizario.documento}
                                            </p>

                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                                                    {cenizario.estado}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    `/cenizarios/${sedeId}/${cenizario.id}`
                                                )
                                            }
                                            className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-100"
                                        >
                                            Ver Cenizario
                                        </button>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}