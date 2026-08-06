"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ObituarioSala {
    id: string;
    sala: string;
    name?: string | null;
    surname?: string | null;
    timeStart?: string | null;
}

interface Sede {
    id: string;
    nombre: string;
    ciudad?: string;
    departamento?: string;
    obituarios?: ObituarioSala[];
}

interface Usuario {
    id?: string;
    email?: string;
}

interface Traslado {
    id: string;
    obituarioNombre: string;
    salaOrigen: string;
    salaDestino: string;
    usuarioEmail?: string | null;
    estado: string;
    createdAt: string;

    sede?: {
        id: string;
        nombre: string;
        ciudad?: string;
        departamento?: string;
    };
}

interface TrasladosTabProps {
    sedes: Sede[];

    usuario?: Usuario | null;

    onTrasladoCompleto?: () =>
        | Promise<void>
        | void;
}

interface TrasladoResponse {
    success: boolean;

    data?: {
        nombreObituario: string;
        traslado: Traslado;
    };

    error?: string;
}

function formatearSala(sala: string) {
    if (sala === "VIP") {
        return "Sala VIP";
    }

    return sala.replaceAll("_", " ");
}

function obtenerNombreObituario(
    obituario?: ObituarioSala
) {
    if (!obituario) {
        return "";
    }

    return [
        obituario.name,
        obituario.surname,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();
}

function formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleString(
        "es-CO",
        {
            dateStyle: "short",
            timeStyle: "short",
        }
    );
}

export function TrasladosTab({
    sedes,
    usuario,
    onTrasladoCompleto,
}: TrasladosTabProps) {
    const [sedeId, setSedeId] =
        useState("");

    const [salaOrigen, setSalaOrigen] =
        useState("");

    const [salaDestino, setSalaDestino] =
        useState("");

    const [historial, setHistorial] =
        useState<Traslado[]>([]);

    const [ejecutando, setEjecutando] =
        useState(false);

    const [cargandoHistorial, setCargandoHistorial] =
        useState(true);

    const cargandoHistorialRef = useRef(false);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    const sedeSeleccionada = useMemo(
        () =>
            sedes.find(
                (sede) => sede.id === sedeId
            ),
        [sedes, sedeId]
    );

    const salas = useMemo(
        () =>
            Array.isArray(
                sedeSeleccionada?.obituarios
            )
                ? sedeSeleccionada.obituarios
                : [],
        [sedeSeleccionada]
    );

    const salasOcupadas = useMemo(
        () =>
            salas.filter((obituario) =>
                Boolean(
                    obituario.name?.trim() ||
                        obituario.surname?.trim()
                )
            ),
        [salas]
    );

    const salasDisponibles = useMemo(
        () =>
            salas.filter(
                (obituario) =>
                    !obituario.name?.trim() &&
                    !obituario.surname?.trim()
            ),
        [salas]
    );

    const obituarioOrigen = useMemo(
        () =>
            salasOcupadas.find(
                (obituario) =>
                    obituario.sala === salaOrigen
            ),
        [salasOcupadas, salaOrigen]
    );

    const salaDestinoSeleccionada = useMemo(
        () =>
            salasDisponibles.find(
                (obituario) =>
                    obituario.sala ===
                    salaDestino
            ),
        [salasDisponibles, salaDestino]
    );

    const cargarHistorial = useCallback(
        async (mostrarCarga = false) => {
            if (cargandoHistorialRef.current) {
                return;
            }

            try {

                cargandoHistorialRef.current = true;

                if (mostrarCarga) {
                    setCargandoHistorial(true);
                }

                setError("");

                const query = sedeId
                    ? `?sedeId=${encodeURIComponent(sedeId)}`
                    : "";

                const response = await fetch(
                    `/api/master/traslados${query}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                const responseText = await response.text();

                console.log("GET TRASLADOS:", {
                    status: response.status,
                    statusText: response.statusText,
                    contentType:
                        response.headers.get("content-type"),
                    body: responseText,
                });

                if (!responseText.trim()) {
                    throw new Error(
                        `La API de traslados respondió sin contenido. Estado HTTP: ${response.status}`
                    );
                }

                let result: {
                    success: boolean;
                    data?: Traslado[];
                    error?: string;
                };

                try {
                    result = JSON.parse(responseText);
                } catch {
                    throw new Error(
                        "La API de traslados no devolvió un JSON válido."
                    );
                }

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.error ??
                            `No fue posible consultar el historial. Estado HTTP: ${response.status}`
                    );
                }

                setHistorial(
                    Array.isArray(result.data)
                        ? result.data
                        : []
                );
            } catch (error) {
                console.error(
                    "Error cargando historial:",
                    error
                );

                setHistorial([]);

                setError(
                    error instanceof Error
                        ? error.message
                        : "No fue posible consultar el historial."
                );
            } finally {

                cargandoHistorialRef.current = false;

                if (mostrarCarga) {
                    setCargandoHistorial(false);
                }
            }
        },
        [sedeId]
    );

    useEffect(() => {
        cargarHistorial(true);

        const interval = window.setInterval(() => {
            /*
            * Actualiza silenciosamente sin mostrar
            * el indicador de carga cada vez.
            */
            if (document.visibilityState === "visible") {
                cargarHistorial(false);
            }
            cargarHistorial(false);
        }, 5000);

        const actualizarAlVolver = () => {
            if (document.visibilityState === "visible") {
                cargarHistorial(false);
            }
        };

        document.addEventListener(
            "visibilitychange",
            actualizarAlVolver
        );

        return () => {
            window.clearInterval(interval);

            document.removeEventListener(
                "visibilitychange",
                actualizarAlVolver
            );
        };
    }, [cargarHistorial]);

    function limpiarFormulario() {
        setSalaOrigen("");
        setSalaDestino("");
        setError("");
        setMensaje("");
    }

    function cambiarSede(
        nuevaSedeId: string
    ) {
        setSedeId(nuevaSedeId);
        setSalaOrigen("");
        setSalaDestino("");
        setError("");
        setMensaje("");
    }

    async function ejecutarTraslado() {
        if (
            !sedeId ||
            !salaOrigen ||
            !salaDestino
        ) {
            setError(
                "Seleccione la sede, la sala de origen y la sala de destino."
            );

            return;
        }

        if (
            salaOrigen === salaDestino
        ) {
            setError(
                "La sala de origen y destino no pueden ser iguales."
            );

            return;
        }
    
        try {
            setEjecutando(true);
            setError("");
            setMensaje("");

            const response = await fetch(
                "/api/master/traslados",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        sedeId,
                        salaOrigen,
                        salaDestino,

                        usuarioId:
                            usuario?.id ?? null,

                        usuarioEmail:
                            usuario?.email ?? null,
                    }),
                }
            );

            const result =
                (await response.json()) as TrasladoResponse;

            if (
                !response.ok ||
                !result.success
            ) {
                setError(
                    result.error ??
                        "No fue posible realizar el traslado."
                );

                return;
            }

            const nombre =
                result.data?.nombreObituario ??
                obtenerNombreObituario(obituarioOrigen);

            const nuevoTraslado =
                result.data?.traslado;

            if (nuevoTraslado) {

                setHistorial((actual) => {

                    const existe =
                        actual.some(
                            t => t.id === nuevoTraslado.id
                        );

                    if (existe) {
                        return actual;
                    }

                    return [
                        nuevoTraslado,
                        ...actual,
                    ];

                });

            }

            setMensaje(
                `${nombre || "El obituario"} fue trasladado correctamente de ${formatearSala(
                    salaOrigen
                )} a ${formatearSala(salaDestino)}.`
            );

            setSalaOrigen("");
            setSalaDestino("");

            await onTrasladoCompleto?.();

            await cargarHistorial(false);
        } catch (error) {
            console.error(
                "Error ejecutando traslado:",
                error
            );

            setError(
                "No fue posible conectar con el servidor."
            );
        } finally {
            setEjecutando(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Encabezado */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">
                        Traslados y Control Operativo
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Gestione el movimiento de
                        obituarios entre las salas de una
                        sede en tiempo real.
                    </p>
                </div>
            </div>

            {/* Panel principal */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/50 p-6">
                    <h4 className="font-bold text-slate-800">
                        Asistente de traslado
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                        Seleccione una sede, una sala
                        ocupada y una sala disponible
                        para migrar toda la información
                        del servicio.
                    </p>
                </div>

                {/* Selector de sede */}
                <div className="border-b border-slate-100 bg-white p-6">
                    <label
                        htmlFor="sede-traslado"
                        className="mb-2 block text-sm font-bold text-slate-700"
                    >
                        Sede donde se realizará el
                        traslado
                    </label>

                    <select
                        id="sede-traslado"
                        value={sedeId}
                        onChange={(event) =>
                            cambiarSede(
                                event.target.value
                            )
                        }
                        disabled={ejecutando}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="">
                            Seleccione una sede
                        </option>

                        {sedes.map((sede) => (
                            <option
                                key={sede.id}
                                value={sede.id}
                            >
                                {sede.nombre}
                                {sede.ciudad
                                    ? ` - ${sede.ciudad}`
                                    : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col items-center justify-between gap-8 bg-slate-50/30 p-6 sm:p-10 md:flex-row">
                    {/* Origen */}
                    <div className="group relative w-full flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            Origen
                        </div>

                        <label
                            htmlFor="sala-origen"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Seleccionar sala actual
                        </label>

                        <select
                            id="sala-origen"
                            value={salaOrigen}
                            onChange={(event) => {
                                setSalaOrigen(
                                    event.target.value
                                );

                                setSalaDestino("");
                                setError("");
                                setMensaje("");
                            }}
                            disabled={
                                ejecutando ||
                                !sedeId ||
                                salasOcupadas.length ===
                                    0
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            <option value="">
                                {!sedeId
                                    ? "Primero seleccione una sede"
                                    : salasOcupadas.length ===
                                        0
                                      ? "No hay salas ocupadas"
                                      : "Seleccione la sala de origen"}
                            </option>

                            {salasOcupadas.map(
                                (obituario) => (
                                    <option
                                        key={
                                            obituario.id
                                        }
                                        value={
                                            obituario.sala
                                        }
                                    >
                                        {formatearSala(
                                            obituario.sala
                                        )}
                                        {" - "}
                                        {obtenerNombreObituario(
                                            obituario
                                        )}
                                    </option>
                                )
                            )}
                        </select>

                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-all">
                            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />

                                Obituario activo
                            </p>

                            <p className="text-sm font-bold text-slate-700">
                                {obituarioOrigen
                                    ? obtenerNombreObituario(
                                          obituarioOrigen
                                      )
                                    : "Seleccione una sala ocupada"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {obituarioOrigen?.timeStart
                                    ? `Transmitiendo desde: ${obituarioOrigen.timeStart}`
                                    : "Sin horario de inicio registrado"}
                            </p>
                        </div>
                    </div>

                    {/* Icono */}
                    <div className="hidden flex-col items-center justify-center md:flex">
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-md">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Destino */}
                    <div className="group relative w-full flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            Destino
                        </div>

                        <label
                            htmlFor="sala-destino"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Seleccionar nueva sala
                        </label>

                        <select
                            id="sala-destino"
                            value={salaDestino}
                            onChange={(event) => {
                                setSalaDestino(
                                    event.target.value
                                );

                                setError("");
                                setMensaje("");
                            }}
                            disabled={
                                ejecutando ||
                                !sedeId ||
                                !salaOrigen ||
                                salasDisponibles.length ===
                                    0
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            <option value="">
                                {!sedeId
                                    ? "Primero seleccione una sede"
                                    : !salaOrigen
                                      ? "Primero seleccione el origen"
                                      : salasDisponibles.length ===
                                          0
                                        ? "No hay salas disponibles"
                                        : "Seleccione una sala disponible"}
                            </option>

                            {salasDisponibles.map(
                                (obituario) => (
                                    <option
                                        key={
                                            obituario.id
                                        }
                                        value={
                                            obituario.sala
                                        }
                                    >
                                        {formatearSala(
                                            obituario.sala
                                        )}{" "}
                                        - Disponible
                                    </option>
                                )
                            )}
                        </select>

                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <div
                                className={`h-2 w-2 rounded-full ${
                                    salaDestinoSeleccionada
                                        ? "animate-pulse bg-emerald-500"
                                        : "bg-slate-300"
                                }`}
                            />

                            <p className="text-sm font-bold text-slate-600">
                                {salaDestinoSeleccionada
                                    ? `${formatearSala(
                                          salaDestinoSeleccionada.sala
                                      )} disponible para traslado`
                                    : "Seleccione una sala de destino"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mensajes */}
                {error && (
                    <div className="mx-6 mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div className="mx-6 mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                        {mensaje}
                    </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 p-6">
                    <button
                        type="button"
                        onClick={limpiarFormulario}
                        disabled={ejecutando}
                        className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={ejecutarTraslado}
                        disabled={
                            ejecutando ||
                            !sedeId ||
                            !salaOrigen ||
                            !salaDestino
                        }
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    >
                        {ejecutando ? (
                            <>
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />

                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>

                                Trasladando...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={
                                            2
                                        }
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />
                                </svg>

                                Ejecutar traslado
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Historial */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
                    <div>
                        <h4 className="font-bold text-slate-800">
                            Historial de movimientos
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                            Últimos traslados realizados
                            en el sistema.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            cargarHistorial(true)
                        }
                        disabled={cargandoHistorial}
                        className="text-xs font-bold text-blue-600 transition-colors hover:text-blue-800 disabled:opacity-50"
                    >
                        {cargandoHistorial
                            ? "Actualizando..."
                            : "Actualizar historial"}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] uppercase tracking-widest text-slate-400">
                                <th className="p-4 font-bold">
                                    Fecha y hora
                                </th>

                                <th className="p-4 font-bold">
                                    Obituario
                                </th>

                                <th className="p-4 font-bold">
                                    Sede
                                </th>

                                <th className="p-4 font-bold">
                                    Origen
                                </th>

                                <th className="p-4 font-bold">
                                    Destino
                                </th>

                                <th className="p-4 font-bold">
                                    Usuario
                                </th>

                                <th className="p-4 font-bold">
                                    Estado
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-sm text-slate-600">
                            {cargandoHistorial ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-10 text-center text-slate-400"
                                    >
                                        Cargando historial...
                                    </td>
                                </tr>
                            ) : historial.length ===
                              0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-10 text-center text-slate-400"
                                    >
                                        No hay traslados
                                        registrados.
                                    </td>
                                </tr>
                            ) : (
                                historial.map(
                                    (traslado) => (
                                        <tr
                                            key={
                                                traslado.id
                                            }
                                            className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                                        >
                                            <td className="whitespace-nowrap p-4">
                                                {formatearFecha(
                                                    traslado.createdAt
                                                )}
                                            </td>

                                            <td className="p-4 font-bold text-slate-700">
                                                {
                                                    traslado.obituarioNombre
                                                }
                                            </td>

                                            <td className="p-4 text-xs font-semibold">
                                                {traslado
                                                    .sede
                                                    ?.nombre ??
                                                    "Sin sede"}
                                            </td>

                                            <td className="p-4">
                                                <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium shadow-sm">
                                                    {formatearSala(
                                                        traslado.salaOrigen
                                                    )}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 shadow-sm">
                                                    {formatearSala(
                                                        traslado.salaDestino
                                                    )}
                                                </span>
                                            </td>

                                            <td className="p-4 text-xs font-medium">
                                                {traslado.usuarioEmail ??
                                                    "No registrado"}
                                            </td>

                                            <td className="p-4">
                                                <span className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-600">
                                                    {traslado.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}