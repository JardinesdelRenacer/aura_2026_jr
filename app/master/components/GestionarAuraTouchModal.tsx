"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    Copy,
    Loader2,
    RefreshCw,
    Tablet,
    Trash2,
    Wifi,
    WifiOff,
    X,
} from "lucide-react";
import ConfirmarEliminacionDispositivoModal from "./ConfirmarEliminacionDispositivoModal";

interface Sede {
    id: string;
    nombre: string;
    ciudad?: string;
    departamento?: string;
    numeroSalas?: number;
    salaVip?: boolean;
}

interface CodigoGenerado {
    id: string;
    codigo: string;
    expiresAt: string;
}

interface AuraTouchRegistrada {
    id: string;
    nombre: string;
    activo: boolean;
    lastSeen: string | null;
    ip: string | null;
    userAgent: string | null;
    createdAt: string;
}

interface Props {
    sede: Sede;
    onClose: () => void;
}

export default function GestionarAuraTouchModal({
    sede,
    onClose,
}: Props) {
    const [codigoGenerado, setCodigoGenerado] =
        useState<CodigoGenerado | null>(null);

    const [tabletas, setTabletas] = useState<
        AuraTouchRegistrada[]
    >([]);

    const [generando, setGenerando] = useState(false);
    const [cargandoTabletas, setCargandoTabletas] =
        useState(true);

    const [copiado, setCopiado] = useState(false);
    const [error, setError] = useState("");
    const [registroExitoso, setRegistroExitoso] =
        useState(false);
    const [tabletaParaEliminar, setTabletaParaEliminar] =
        useState<AuraTouchRegistrada | null>(null);
    const [eliminandoTableta, setEliminandoTableta] = useState(false);

    /*
     * Conserva la cantidad anterior para detectar
     * cuándo aparece una tableta nueva.
     */
    const cantidadAnterior = useRef<number | null>(null);

    const cargarTabletas = useCallback(
        async (mostrarCarga = false) => {
            try {
                if (mostrarCarga) {
                    setCargandoTabletas(true);
                }

                const response = await fetch(
                    `/api/master/sedes/${sede.id}/aura-touch`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.error ??
                            "No fue posible consultar las tabletas."
                    );
                }

                const nuevasTabletas: AuraTouchRegistrada[] =
                    Array.isArray(result.data)
                        ? result.data
                        : [];

                /*
                 * Si antes había menos tabletas y ahora hay
                 * una nueva, mostramos confirmación.
                 */
                if (
                    cantidadAnterior.current !== null &&
                    nuevasTabletas.length >
                        cantidadAnterior.current
                ) {
                    setRegistroExitoso(true);
                    setCodigoGenerado(null);

                    window.setTimeout(() => {
                        setRegistroExitoso(false);
                    }, 5000);
                }

                cantidadAnterior.current =
                    nuevasTabletas.length;

                setTabletas(nuevasTabletas);
            } catch (error) {
                console.error(
                    "Error cargando tabletas:",
                    error
                );

                if (mostrarCarga) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "No fue posible consultar las tabletas."
                    );
                }
            } finally {
                if (mostrarCarga) {
                    setCargandoTabletas(false);
                }
            }
        },
        [sede.id]
    );

    const generarCodigo = async () => {
        if (generando) return;

        try {
            setGenerando(true);
            setError("");
            setCopiado(false);
            setRegistroExitoso(false);

            const response = await fetch(
                "/api/master/codigos-registro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        sedeId: sede.id,
                        tipoDispositivo: "AURA_TOUCH",
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                setError(
                    result.error ??
                        "No fue posible generar el código."
                );
                return;
            }

            setCodigoGenerado(result.data);
        } catch (error) {
            console.error(
                "Error generando código Aura Touch:",
                error
            );

            setError(
                "No fue posible conectar con el servidor."
            );
        } finally {
            setGenerando(false);
        }
    };

    const copiarCodigo = async () => {
        if (!codigoGenerado?.codigo) return;

        try {
            await navigator.clipboard.writeText(
                codigoGenerado.codigo
            );

            setCopiado(true);

            window.setTimeout(() => {
                setCopiado(false);
            }, 2000);
        } catch (error) {
            console.error(
                "Error copiando código:",
                error
            );

            setError(
                "No fue posible copiar el código."
            );
        }
    };

    useEffect(() => {
        cargarTabletas(true);

        const interval = window.setInterval(() => {
            cargarTabletas(false);
        }, 3000);

        return () => {
            window.clearInterval(interval);
        };
    }, [cargarTabletas]);

    useEffect(() => {
        const cerrarConEscape = (
            event: KeyboardEvent
        ) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            cerrarConEscape
        );

        return () => {
            window.removeEventListener(
                "keydown",
                cerrarConEscape
            );
        };
    }, [onClose]);

    const fechaExpiracion = codigoGenerado
        ? new Date(
              codigoGenerado.expiresAt
          ).toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

    const salas = Array.from(
        {
            length: Math.min(
                Math.max(sede.numeroSalas ?? 0, 0),
                3
            ),
        },
        (_, index) => `Sala ${index + 1}`
    );

    if (sede.salaVip) {
        salas.push("Sala VIP");
    }

    function estaOnline(
        tableta: AuraTouchRegistrada
    ) {
        if (!tableta.activo || !tableta.lastSeen) {
            return false;
        }

        return (
            Date.now() -
                new Date(
                    tableta.lastSeen
                ).getTime() <
            15000
        );
    }

    function formatearFecha(fecha: string | null) {
        if (!fecha) {
            return "Sin conexión registrada";
        }

        return new Date(fecha).toLocaleString(
            "es-CO",
            {
                dateStyle: "short",
                timeStyle: "short",
            }
        );
    }

    async function eliminarTableta() {
        if (!tabletaParaEliminar) return;

        try {
            setEliminandoTableta(true);
            setError("");

            const response = await fetch(
                `/api/master/aura-touch/${tabletaParaEliminar.id}`,
                { method: "DELETE" }
            );
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error ?? "No fue posible eliminar la tableta."
                );
            }

            setTabletas((actuales) =>
                actuales.filter((actual) => actual.id !== tabletaParaEliminar.id)
            );
            setTabletaParaEliminar(null);
        } catch (error) {
            console.error("Error eliminando tableta:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "No fue posible eliminar la tableta."
            );
        } finally {
            setEliminandoTableta(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 p-5 backdrop-blur-md"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                            <Tablet size={25} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                Gestionar Aura Touch
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Sede{" "}
                                <span className="font-bold text-slate-700">
                                    {sede.nombre}
                                </span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                        aria-label="Cerrar modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[calc(92vh-180px)] overflow-y-auto px-8 py-7">
                    {/* Confirmación */}
                    {registroExitoso && (
                        <div className="mb-6 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
                            <CheckCircle2
                                size={24}
                                className="mt-0.5 shrink-0"
                            />

                            <div>
                                <p className="font-black">
                                    Tableta registrada
                                    correctamente
                                </p>

                                <p className="mt-1 text-sm text-emerald-700">
                                    El dispositivo ya se
                                    encuentra vinculado con
                                    esta sede.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Sede */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Sede seleccionada
                        </p>

                        <h3 className="mt-2 text-xl font-black text-slate-800">
                            {sede.nombre}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {[sede.ciudad, sede.departamento]
                                .filter(Boolean)
                                .join(" · ")}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {salas.map((sala) => (
                                <span
                                    key={sala}
                                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                                >
                                    {sala}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Listado */}
                    <section className="mt-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-slate-800">
                                    Tabletas registradas
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Dispositivos vinculados a
                                    esta sede.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    cargarTabletas(true)
                                }
                                disabled={
                                    cargandoTabletas
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                aria-label="Actualizar tabletas"
                            >
                                <RefreshCw
                                    size={18}
                                    className={
                                        cargandoTabletas
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                            </button>
                        </div>

                        {cargandoTabletas ? (
                            <div className="mt-5 flex items-center justify-center rounded-2xl border border-slate-200 py-10 text-slate-500">
                                <Loader2
                                    className="mr-3 animate-spin"
                                    size={21}
                                />

                                Cargando tabletas...
                            </div>
                        ) : tabletas.length === 0 ? (
                            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center">
                                <Tablet
                                    size={35}
                                    className="mx-auto text-slate-300"
                                />

                                <p className="mt-3 font-bold text-slate-600">
                                    No hay tabletas registradas
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Genera un código para
                                    vincular la primera.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-3">
                                {tabletas.map((tableta) => {
                                    const online =
                                        estaOnline(
                                            tableta
                                        );

                                    return (
                                        <article
                                            key={
                                                tableta.id
                                            }
                                            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                        >
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                                    online
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                <Tablet
                                                    size={23}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="truncate font-black text-slate-800">
                                                        {
                                                            tableta.nombre
                                                        }
                                                    </h4>

                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                                                            online
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        {online ? (
                                                            <Wifi
                                                                size={
                                                                    12
                                                                }
                                                            />
                                                        ) : (
                                                            <WifiOff
                                                                size={
                                                                    12
                                                                }
                                                            />
                                                        )}

                                                        {online
                                                            ? "Online"
                                                            : "Offline"}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Última
                                                    conexión:{" "}
                                                    {formatearFecha(
                                                        tableta.lastSeen
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setTabletaParaEliminar(tableta)}
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                                                aria-label={`Eliminar ${tableta.nombre}`}
                                                title="Eliminar tableta"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Generación */}
                    <section className="mt-8 border-t border-slate-100 pt-7">
                        {!codigoGenerado ? (
                            <div className="text-center">
                                <h3 className="text-lg font-black text-slate-800">
                                    Vincular una nueva tableta
                                </h3>

                                <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                                    Genera un código y
                                    escríbelo en la tableta que
                                    deseas registrar.
                                </p>

                                <button
                                    type="button"
                                    onClick={generarCodigo}
                                    disabled={generando}
                                    className="mt-6 inline-flex items-center justify-center gap-3 rounded-xl bg-violet-600 px-8 py-3 font-bold text-white transition hover:bg-violet-700 disabled:bg-slate-300"
                                >
                                    {generando ? (
                                        <>
                                            <Loader2
                                                className="animate-spin"
                                                size={20}
                                            />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <Tablet
                                                size={20}
                                            />
                                            Generar código
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-8 text-center">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
                                    Código Aura Touch
                                </p>

                                <div className="mt-4 font-mono text-5xl font-black tracking-[0.18em] text-slate-900">
                                    {
                                        codigoGenerado.codigo
                                    }
                                </div>

                                <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
                                    <Clock3 size={17} />
                                    Válido hasta las{" "}
                                    {fechaExpiracion}
                                </div>

                                <p className="mx-auto mt-5 max-w-md rounded-xl border border-violet-100 bg-white/70 px-4 py-3 text-sm leading-relaxed text-slate-600">
                                    En la tableta abre <strong>/kiosk/condolencias/registrar</strong> e ingresa este código. No uses <strong>/display/registrar</strong>, que es exclusivo para pantallas de proyección.
                                </p>

                                <button
                                    type="button"
                                    onClick={copiarCodigo}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-5 py-3 font-bold text-violet-700"
                                >
                                    {copiado ? (
                                        <>
                                            <CheckCircle2
                                                size={18}
                                            />
                                            Código copiado
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={18} />
                                            Copiar código
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </section>

                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
                        >
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-8 py-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            <ConfirmarEliminacionDispositivoModal
                open={Boolean(tabletaParaEliminar)}
                tipo="tableta"
                nombre={tabletaParaEliminar?.nombre ?? ""}
                loading={eliminandoTableta}
                onCancel={() => setTabletaParaEliminar(null)}
                onConfirm={() => void eliminarTableta()}
            />
        </div>
    );
}
