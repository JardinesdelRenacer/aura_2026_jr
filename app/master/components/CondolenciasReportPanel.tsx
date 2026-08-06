"use client";

import { useEffect, useState } from "react";
import {
    Download,
    FileHeart,
    Loader2,
    MapPin,
    MessageSquareHeart,
    RefreshCw,
    UserRound,
} from "lucide-react";

import { exportCondolenciasPdf } from "@/src/utils/exportCondolenciasPdf";

interface Branch {
    id: string;
    nombre: string;
    ciudad: string;
    departamento: string;
}

interface ObituarioResumen {
    id: string;
    name: string;
    surname: string;
    sala: string;
    estado: string;
    createdAt: string;

    _count: {
        condolencias: number;
    };
}

interface Condolencia {
    id: string;
    codigo?: string | null;
    fullName: string;
    phone: string;
    message: string;
    estado: string;
    createdAt: string;
}

interface ReporteCondolencias {
    id: string;
    name: string;
    surname: string;
    sala: string;
    estado: string;

    sede: {
        id: string;
        nombre: string;
        ciudad: string;
        departamento: string;
    };

    condolencias: Condolencia[];
}

interface Props {
    branches: Branch[];
}

export default function CondolenciasReportPanel({
    branches,
}: Props) {
    const [sedeId, setSedeId] = useState("");
    const [obituarioId, setObituarioId] =
        useState("");

    const [obituarios, setObituarios] = useState<
        ObituarioResumen[]
    >([]);

    const [reporte, setReporte] =
        useState<ReporteCondolencias | null>(null);

    const [cargandoObituarios, setCargandoObituarios] =
        useState(false);

    const [cargandoReporte, setCargandoReporte] =
        useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        setObituarioId("");
        setReporte(null);
        setObituarios([]);

        if (!sedeId) return;

        const cargarObituarios = async () => {
            try {
                setCargandoObituarios(true);
                setError("");

                const response = await fetch(
                    `/api/master/reportes/condolencias?sedeId=${encodeURIComponent(
                        sedeId
                    )}`,
                    {
                        cache: "no-store",
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.error ??
                            "No fue posible cargar los obituarios."
                    );
                }

                setObituarios(
                    Array.isArray(result.data)
                        ? result.data
                        : []
                );
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "No fue posible cargar los obituarios."
                );
            } finally {
                setCargandoObituarios(false);
            }
        };

        cargarObituarios();
    }, [sedeId]);

    useEffect(() => {
        setReporte(null);

        if (!obituarioId) return;

        const cargarReporte = async () => {
            try {
                setCargandoReporte(true);
                setError("");

                const response = await fetch(
                    `/api/master/reportes/condolencias?obituarioId=${encodeURIComponent(
                        obituarioId
                    )}`,
                    {
                        cache: "no-store",
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.error ??
                            "No fue posible cargar las condolencias."
                    );
                }

                setReporte(result.data);
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "No fue posible cargar las condolencias."
                );
            } finally {
                setCargandoReporte(false);
            }
        };

        cargarReporte();
    }, [obituarioId]);

    const actualizarReporte = async () => {
        if (!obituarioId) return;

        try {
            setCargandoReporte(true);
            setError("");

            const response = await fetch(
                `/api/master/reportes/condolencias?obituarioId=${encodeURIComponent(
                    obituarioId
                )}`,
                {
                    cache: "no-store",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error ??
                        "No fue posible actualizar el reporte."
                );
            }

            setReporte(result.data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "No fue posible actualizar el reporte."
            );
        } finally {
            setCargandoReporte(false);
        }
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                            <FileHeart size={23} />
                        </div>

                        <div>
                            <h3 className="text-xl font-black text-slate-800">
                                Reporte de condolencias
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Consulta y exporta los mensajes
                                recibidos por cada obituario.
                            </p>
                        </div>
                    </div>
                </div>

                {reporte && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={actualizarReporte}
                            disabled={cargandoReporte}
                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    cargandoReporte
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Actualizar
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await exportCondolenciasPdf(reporte);
                                } catch (error) {
                                    console.error(
                                        "Error exportando libro de condolencias:",
                                        error
                                    );

                                    setError(
                                        "No fue posible generar el libro de condolencias."
                                    );
                                }
                            }}

                            // // ---
                            // onClick={() =>
                            //     exportCondolenciasPdf(reporte)
                            // }
                            
                            disabled={
                                reporte.condolencias.length ===
                                0
                            }
                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            <Download size={18} />

                            Exportar PDF
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="reporte-sede"
                        className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                    >
                        Sede
                    </label>

                    <select
                        id="reporte-sede"
                        value={sedeId}
                        onChange={(event) =>
                            setSedeId(event.target.value)
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="">
                            Seleccione una sede
                        </option>

                        {branches.map((branch) => (
                            <option
                                key={branch.id}
                                value={branch.id}
                            >
                                {branch.nombre} -{" "}
                                {branch.ciudad}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="reporte-obituario"
                        className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                    >
                        Obituario
                    </label>

                    <select
                        id="reporte-obituario"
                        value={obituarioId}
                        onChange={(event) =>
                            setObituarioId(
                                event.target.value
                            )
                        }
                        disabled={
                            !sedeId ||
                            cargandoObituarios
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                        <option value="">
                            {cargandoObituarios
                                ? "Cargando obituarios..."
                                : "Seleccione un obituario"}
                        </option>

                        {obituarios.map((obituario) => (
                            <option
                                key={obituario.id}
                                value={obituario.id}
                            >
                                {obituario.name}{" "}
                                {obituario.surname} -{" "}
                                {obituario.sala.replace(
                                    "_",
                                    " "
                                )}{" "}
                                (
                                {
                                    obituario._count
                                        .condolencias
                                }{" "}
                                mensajes)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
                >
                    {error}
                </div>
            )}

            {cargandoReporte && (
                <div className="mt-7 flex items-center justify-center rounded-2xl border border-slate-200 py-12 text-slate-500">
                    <Loader2
                        className="mr-3 animate-spin"
                        size={22}
                    />

                    Cargando condolencias...
                </div>
            )}

            {!cargandoReporte && reporte && (
                <div className="mt-7">
                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <UserRound
                                size={21}
                                className="text-blue-700"
                            />

                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    Obituario
                                </p>

                                <p className="font-black text-slate-800">
                                    {reporte.name}{" "}
                                    {reporte.surname}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin
                                size={21}
                                className="text-blue-700"
                            />

                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    Sede y sala
                                </p>

                                <p className="font-black text-slate-800">
                                    {reporte.sede.nombre} ·{" "}
                                    {reporte.sala.replace(
                                        "_",
                                        " "
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MessageSquareHeart
                                size={21}
                                className="text-blue-700"
                            />

                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400">
                                    Total
                                </p>

                                <p className="font-black text-slate-800">
                                    {
                                        reporte.condolencias
                                            .length
                                    }{" "}
                                    condolencias
                                </p>
                            </div>
                        </div>
                    </div>

                    {reporte.condolencias.length === 0 ? (
                        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-500">
                            Este obituario aún no tiene
                            condolencias registradas.
                        </div>
                    ) : (
                        <div className="mt-5 space-y-4">
                            {reporte.condolencias.map(
                                (condolencia, index) => (
                                    <article
                                        key={condolencia.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                                                    Condolencia{" "}
                                                    {index + 1}
                                                </p>

                                                <h4 className="mt-1 font-black text-slate-800">
                                                    {
                                                        condolencia.fullName
                                                    }
                                                </h4>
                                            </div>

                                            <p className="text-xs font-semibold text-slate-400">
                                                {new Date(
                                                    condolencia.createdAt
                                                ).toLocaleString(
                                                    "es-CO"
                                                )}
                                            </p>
                                        </div>

                                        <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-4 text-sm leading-relaxed text-slate-700">
                                            {
                                                condolencia.message
                                            }
                                        </p>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}