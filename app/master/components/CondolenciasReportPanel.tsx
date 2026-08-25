"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Activity,
    Archive,
    Download,
    FileHeart,
    History,
    Loader2,
    MapPin,
    MessageSquareHeart,
    RefreshCw,
    Search,
    UserRound,
} from "lucide-react";

import {
    exportCondolenciasPdf,
} from "@/src/utils/exportCondolenciasPdf";

interface Branch {
    id: string;
    nombre: string;
    ciudad: string;
    departamento: string;
}

interface ObituarioResumen {
    id: string;

    codigo?: string | null;

    name: string;
    surname: string;

    sala: string;
    estado: string;

    createdAt: string;
    updatedAt?: string;

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

    codigo?: string | null;

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

type VistaReporte =
    | "activos"
    | "historial";

type EstadoFiltro =
    | "TODOS"
    | "ACTIVO"
    | "FINALIZADO"
    | "ARCHIVADO";

function formatearSala(
    sala: string
) {
    if (sala === "VIP") {
        return "Sala VIP";
    }

    return sala
        .replaceAll("_", " ");
}

function formatearFecha(
    value: string
) {
    return new Date(
        value
    ).toLocaleString(
        "es-CO"
    );
}

function estiloEstado(
    estado: string
) {
    if (estado === "ACTIVO") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (
        estado ===
        "FINALIZADO"
    ) {
        return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (
        estado ===
        "ARCHIVADO"
    ) {
        return "border-slate-200 bg-slate-100 text-slate-600";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function CondolenciasReportPanel({
    branches,
}: Props) {
    const [
        sedeId,
        setSedeId,
    ] = useState("");

    const [
        obituarioId,
        setObituarioId,
    ] = useState("");

    const [
        vista,
        setVista,
    ] =
        useState<VistaReporte>(
            "activos"
        );

    const [
        estadoFiltro,
        setEstadoFiltro,
    ] =
        useState<EstadoFiltro>(
            "TODOS"
        );

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        searchDebounced,
        setSearchDebounced,
    ] = useState("");

    const [
        obituarios,
        setObituarios,
    ] = useState<
        ObituarioResumen[]
    >([]);

    const [
        reporte,
        setReporte,
    ] =
        useState<ReporteCondolencias | null>(
            null
        );

    const [
        cargandoObituarios,
        setCargandoObituarios,
    ] = useState(false);

    const [
        cargandoReporte,
        setCargandoReporte,
    ] = useState(false);

    const [
        exportandoPdf,
        setExportandoPdf,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // ============================================
    // DEBOUNCE BUSCADOR
    // ============================================

    useEffect(() => {
        const timer =
            window.setTimeout(
                () => {
                    setSearchDebounced(
                        search.trim()
                    );
                },
                400
            );

        return () =>
            window.clearTimeout(
                timer
            );
    }, [search]);

    // ============================================
    // CARGAR LISTADO
    // ============================================

    const cargarObituarios =
        useCallback(
            async () => {
                if (!sedeId) {
                    setObituarios(
                        []
                    );

                    return;
                }

                try {
                    setCargandoObituarios(
                        true
                    );

                    setError("");

                    const params =
                        new URLSearchParams();

                    params.set(
                        "sedeId",
                        sedeId
                    );

                    if (
                        searchDebounced
                    ) {
                        params.set(
                            "search",
                            searchDebounced
                        );
                    }

                    /*
                     * Vista activos:
                     * solamente ACTIVO.
                     */
                    if (
                        vista ===
                        "activos"
                    ) {
                        params.set(
                            "estado",
                            "ACTIVO"
                        );
                    }

                    /*
                     * Historial:
                     * TODOS no manda estado.
                     *
                     * Así trae:
                     * ACTIVO
                     * FINALIZADO
                     * ARCHIVADO
                     */
                    if (
                        vista ===
                            "historial" &&
                        estadoFiltro !==
                            "TODOS"
                    ) {
                        params.set(
                            "estado",
                            estadoFiltro
                        );
                    }

                    const response =
                        await fetch(
                            `/api/master/reportes/condolencias?${params.toString()}`,
                            {
                                cache:
                                    "no-store",
                            }
                        );

                    const result =
                        await response.json();

                    if (
                        !response.ok ||
                        !result.success
                    ) {
                        throw new Error(
                            result.error ??
                                "No fue posible cargar los obituarios."
                        );
                    }

                    setObituarios(
                        Array.isArray(
                            result.data
                        )
                            ? result.data
                            : []
                    );
                } catch (
                    error
                ) {
                    console.error(
                        "Error cargando historial:",
                        error
                    );

                    setError(
                        error instanceof
                            Error
                            ? error.message
                            : "No fue posible cargar los obituarios."
                    );

                    setObituarios(
                        []
                    );
                } finally {
                    setCargandoObituarios(
                        false
                    );
                }
            },
            [
                sedeId,
                vista,
                estadoFiltro,
                searchDebounced,
            ]
        );

    useEffect(() => {
        setObituarioId("");
        setReporte(null);

        cargarObituarios();
    }, [
        cargarObituarios,
    ]);

    // ============================================
    // CARGAR REPORTE INDIVIDUAL
    // ============================================

    const cargarReporte =
        useCallback(
            async (
                id: string
            ) => {
                if (!id) {
                    setReporte(
                        null
                    );

                    return;
                }

                try {
                    setCargandoReporte(
                        true
                    );

                    setError("");

                    const response =
                        await fetch(
                            `/api/master/reportes/condolencias?obituarioId=${encodeURIComponent(
                                id
                            )}`,
                            {
                                cache:
                                    "no-store",
                            }
                        );

                    const result =
                        await response.json();

                    if (
                        !response.ok ||
                        !result.success
                    ) {
                        throw new Error(
                            result.error ??
                                "No fue posible cargar las condolencias."
                        );
                    }

                    setReporte(
                        result.data
                    );
                } catch (
                    error
                ) {
                    console.error(
                        "Error cargando reporte:",
                        error
                    );

                    setError(
                        error instanceof
                            Error
                            ? error.message
                            : "No fue posible cargar las condolencias."
                    );
                } finally {
                    setCargandoReporte(
                        false
                    );
                }
            },
            []
        );

    useEffect(() => {
        if (
            !obituarioId
        ) {
            setReporte(null);

            return;
        }

        cargarReporte(
            obituarioId
        );
    }, [
        obituarioId,
        cargarReporte,
    ]);

    // ============================================
    // ACTUALIZAR
    // ============================================

    const actualizarReporte =
        async () => {
            if (
                !obituarioId
            ) {
                return;
            }

            await cargarReporte(
                obituarioId
            );

            await cargarObituarios();
        };

    // ============================================
    // EXPORTAR PDF
    // ============================================

    const exportarPdf =
        async () => {
            if (
                !reporte ||
                exportandoPdf
            ) {
                return;
            }

            try {
                setExportandoPdf(
                    true
                );

                setError("");

                await exportCondolenciasPdf(
                    reporte
                );
            } catch (
                error
            ) {
                console.error(
                    "Error exportando libro de condolencias:",
                    error
                );

                setError(
                    "No fue posible generar el libro de condolencias."
                );
            } finally {
                setExportandoPdf(
                    false
                );
            }
        };

    // ============================================
    // CAMBIAR VISTA
    // ============================================

    function cambiarVista(
        nuevaVista: VistaReporte
    ) {
        setVista(
            nuevaVista
        );

        setEstadoFiltro(
            "TODOS"
        );

        setSearch("");

        setSearchDebounced(
            ""
        );

        setObituarioId("");

        setReporte(null);
    }

    // ============================================
    // SELECCIONAR OBITUARIO
    // ============================================

    function seleccionarObituario(
        id: string
    ) {
        setObituarioId(id);
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* ====================================== */}
            {/* HEADER */}
            {/* ====================================== */}

            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                        <FileHeart
                            size={
                                23
                            }
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-slate-800">
                            Reporte de
                            condolencias
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Consulta el
                            historial de
                            servicios y
                            exporta las
                            condolencias
                            individualmente.
                        </p>
                    </div>
                </div>

                {reporte && (
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={
                                actualizarReporte
                            }
                            disabled={
                                cargandoReporte
                            }
                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={
                                    17
                                }
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
                            onClick={
                                exportarPdf
                            }
                            disabled={
                                reporte
                                    .condolencias
                                    .length ===
                                    0 ||
                                exportandoPdf
                            }
                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {exportandoPdf ? (
                                <Loader2
                                    size={
                                        18
                                    }
                                    className="animate-spin"
                                />
                            ) : (
                                <Download
                                    size={
                                        18
                                    }
                                />
                            )}

                            {exportandoPdf
                                ? "Generando PDF..."
                                : "Exportar PDF"}
                        </button>
                    </div>
                )}
            </div>

            {/* ====================================== */}
            {/* SEDE */}
            {/* ====================================== */}

            <div className="mt-6">
                <label
                    htmlFor="reporte-sede"
                    className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                    Sede
                </label>

                <select
                    id="reporte-sede"
                    value={
                        sedeId
                    }
                    onChange={(
                        event
                    ) => {
                        setSedeId(
                            event
                                .target
                                .value
                        );

                        setObituarioId(
                            ""
                        );

                        setReporte(
                            null
                        );
                    }}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:max-w-xl"
                >
                    <option value="">
                        Seleccione
                        una sede
                    </option>

                    {branches.map(
                        (
                            branch
                        ) => (
                            <option
                                key={
                                    branch.id
                                }
                                value={
                                    branch.id
                                }
                            >
                                {
                                    branch.nombre
                                }{" "}
                                -{" "}
                                {
                                    branch.ciudad
                                }
                            </option>
                        )
                    )}
                </select>
            </div>

            {/* ====================================== */}
            {/* TABS */}
            {/* ====================================== */}

            {sedeId && (
                <>
                    <div className="mt-6 flex w-fit rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                        <button
                            type="button"
                            onClick={() =>
                                cambiarVista(
                                    "activos"
                                )
                            }
                            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                                vista ===
                                "activos"
                                    ? "bg-white text-emerald-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <Activity
                                size={
                                    17
                                }
                            />

                            Servicios
                            activos
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                cambiarVista(
                                    "historial"
                                )
                            }
                            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                                vista ===
                                "historial"
                                    ? "bg-white text-blue-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <History
                                size={
                                    17
                                }
                            />

                            Historial
                        </button>
                    </div>

                    {/* ================================= */}
                    {/* BUSCADOR */}
                    {/* ================================= */}

                    <div className="mt-5 flex flex-col gap-4 lg:flex-row">
                        <div className="relative flex-1">
                            <Search
                                size={
                                    18
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Buscar por código, nombre, apellido o sala..."
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        {vista ===
                            "historial" && (
                            <select
                                value={
                                    estadoFiltro
                                }
                                onChange={(
                                    event
                                ) =>
                                    setEstadoFiltro(
                                        event
                                            .target
                                            .value as EstadoFiltro
                                    )
                                }
                                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 outline-none transition focus:border-blue-500"
                            >
                                <option value="TODOS">
                                    Todos
                                    los
                                    estados
                                </option>

                                <option value="ACTIVO">
                                    Activos
                                </option>

                                <option value="FINALIZADO">
                                    Finalizados
                                </option>

                                <option value="ARCHIVADO">
                                    Archivados
                                </option>
                            </select>
                        )}
                    </div>
                </>
            )}

            {/* ====================================== */}
            {/* ERROR */}
            {/* ====================================== */}

            {error && (
                <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
                >
                    {error}
                </div>
            )}

            {/* ====================================== */}
            {/* LISTADO */}
            {/* ====================================== */}

            {sedeId && (
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h4 className="font-black text-slate-800">
                                {vista ===
                                "activos"
                                    ? "Servicios activos"
                                    : "Historial de servicios"}
                            </h4>

                            <p className="mt-1 text-xs text-slate-400">
                                {
                                    obituarios.length
                                }{" "}
                                registros
                                encontrados
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                cargarObituarios
                            }
                            disabled={
                                cargandoObituarios
                            }
                            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={
                                    14
                                }
                                className={
                                    cargandoObituarios
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Actualizar
                        </button>
                    </div>

                    {cargandoObituarios ? (
                        <div className="flex items-center justify-center rounded-2xl border border-slate-200 py-12 text-slate-500">
                            <Loader2
                                className="mr-3 animate-spin"
                                size={
                                    22
                                }
                            />

                            Cargando
                            servicios...
                        </div>
                    ) : obituarios.length ===
                      0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
                            <Archive
                                size={
                                    34
                                }
                                className="mx-auto text-slate-300"
                            />

                            <p className="mt-3 font-bold text-slate-600">
                                No se
                                encontraron
                                servicios
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Prueba con
                                otro filtro
                                o término de
                                búsqueda.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                            {obituarios.map(
                                (
                                    obituario
                                ) => {
                                    const seleccionado =
                                        obituarioId ===
                                        obituario.id;

                                    return (
                                        <article
                                            key={
                                                obituario.id
                                            }
                                            className={`rounded-2xl border p-5 transition ${
                                                seleccionado
                                                    ? "border-blue-400 bg-blue-50/50 shadow-md"
                                                    : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-black tracking-wider text-white">
                                                            {obituario.codigo ??
                                                                "SIN CÓDIGO"}
                                                        </span>

                                                        <span
                                                            className={`rounded-lg border px-2.5 py-1 text-[10px] font-black tracking-wider ${estiloEstado(
                                                                obituario.estado
                                                            )}`}
                                                        >
                                                            {
                                                                obituario.estado
                                                            }
                                                        </span>
                                                    </div>

                                                    <h5 className="mt-3 text-lg font-black text-slate-800">
                                                        {
                                                            obituario.name
                                                        }{" "}
                                                        {
                                                            obituario.surname
                                                        }
                                                    </h5>

                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                                                        <span>
                                                            {formatearSala(
                                                                obituario.sala
                                                            )}
                                                        </span>

                                                        <span>
                                                            {
                                                                obituario
                                                                    ._count
                                                                    .condolencias
                                                            }{" "}
                                                            condolencias
                                                        </span>

                                                        <span>
                                                            {formatearFecha(
                                                                obituario.createdAt
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        seleccionarObituario(
                                                            obituario.id
                                                        )
                                                    }
                                                    className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                                                        seleccionado
                                                            ? "bg-blue-600 text-white"
                                                            : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                    }`}
                                                >
                                                    {seleccionado
                                                        ? "Seleccionado"
                                                        : "Ver reporte"}
                                                </button>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ====================================== */}
            {/* CARGANDO REPORTE */}
            {/* ====================================== */}

            {cargandoReporte && (
                <div className="mt-7 flex items-center justify-center rounded-2xl border border-slate-200 py-12 text-slate-500">
                    <Loader2
                        className="mr-3 animate-spin"
                        size={
                            22
                        }
                    />

                    Cargando
                    condolencias...
                </div>
            )}

            {/* ====================================== */}
            {/* REPORTE INDIVIDUAL */}
            {/* ====================================== */}

            {!cargandoReporte &&
                reporte && (
                    <div className="mt-8 border-t border-slate-100 pt-7">

                        <div className="mb-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                                {
                                    reporte.codigo
                                }
                            </p>

                            <h4 className="mt-1 text-xl font-black text-slate-800">
                                Libro de
                                condolencias
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:grid-cols-3">
                            <div className="flex items-center gap-3">
                                <UserRound
                                    size={
                                        21
                                    }
                                    className="text-blue-700"
                                />

                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400">
                                        Obituario
                                    </p>

                                    <p className="font-black text-slate-800">
                                        {
                                            reporte.name
                                        }{" "}
                                        {
                                            reporte.surname
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin
                                    size={
                                        21
                                    }
                                    className="text-blue-700"
                                />

                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400">
                                        Sede y
                                        sala
                                    </p>

                                    <p className="font-black text-slate-800">
                                        {
                                            reporte
                                                .sede
                                                .nombre
                                        }{" "}
                                        ·{" "}
                                        {formatearSala(
                                            reporte.sala
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MessageSquareHeart
                                    size={
                                        21
                                    }
                                    className="text-blue-700"
                                />

                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400">
                                        Total
                                    </p>

                                    <p className="font-black text-slate-800">
                                        {
                                            reporte
                                                .condolencias
                                                .length
                                        }{" "}
                                        condolencias
                                    </p>
                                </div>
                            </div>
                        </div>

                        {reporte
                            .condolencias
                            .length ===
                        0 ? (
                            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-500">
                                Este
                                obituario
                                aún no
                                tiene
                                condolencias
                                registradas.
                            </div>
                        ) : (
                            <div className="mt-5 space-y-4">
                                {reporte.condolencias.map(
                                    (
                                        condolencia,
                                        index
                                    ) => (
                                        <article
                                            key={
                                                condolencia.id
                                            }
                                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                                                        Condolencia{" "}
                                                        {index +
                                                            1}
                                                    </p>

                                                    <h5 className="mt-1 font-black text-slate-800">
                                                        {
                                                            condolencia.fullName
                                                        }
                                                    </h5>
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