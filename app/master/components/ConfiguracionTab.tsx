"use client";

import {
    ChangeEvent,
    useCallback,
    useEffect,
    useState,
} from "react";

interface ConfiguracionGlobal {
    id: string;

    companyName: string;
    companyPhone: string | null;
    companyEmail: string | null;
    companyWebsite: string | null;

    logo: string | null;

    primaryColor: string;
    secondaryColor: string;

    autoplay: boolean;
    seconds: number;
    transitionEffect: string;

    auraTouchTimeout: number;
    keyboardEnabled: boolean;

    refreshInterval: number;
    maintenanceMode: boolean;

    createdAt?: string;
    updatedAt?: string;
}

const CONFIGURACION_INICIAL: ConfiguracionGlobal = {
    id: "GLOBAL",

    companyName: "Jardines del Renacer",
    companyPhone: "",
    companyEmail: "",
    companyWebsite: "",

    logo: "",

    primaryColor: "#2563EB",
    secondaryColor: "#0F172A",

    autoplay: true,
    seconds: 10,
    transitionEffect: "fade",

    auraTouchTimeout: 90,
    keyboardEnabled: true,

    refreshInterval: 5,
    maintenanceMode: false,
};

export function ConfiguracionTab() {
    const [configuracion, setConfiguracion] =
        useState<ConfiguracionGlobal>(
            CONFIGURACION_INICIAL
        );

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    const cargarConfiguracion = useCallback(
        async () => {
            try {
                setCargando(true);
                setError("");

                const response = await fetch(
                    "/api/master/configuracion",
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                const responseText =
                    await response.text();

                if (!responseText.trim()) {
                    throw new Error(
                        "La API de configuración respondió sin contenido."
                    );
                }

                const result = JSON.parse(
                    responseText
                ) as {
                    success: boolean;
                    data?: ConfiguracionGlobal;
                    error?: string;
                };

                if (
                    !response.ok ||
                    !result.success ||
                    !result.data
                ) {
                    throw new Error(
                        result.error ??
                            "No fue posible cargar la configuración."
                    );
                }

                setConfiguracion({
                    ...CONFIGURACION_INICIAL,
                    ...result.data,

                    companyPhone:
                        result.data.companyPhone ??
                        "",

                    companyEmail:
                        result.data.companyEmail ??
                        "",

                    companyWebsite:
                        result.data.companyWebsite ??
                        "",

                    logo:
                        result.data.logo ?? "",
                });
            } catch (error) {
                console.error(
                    "Error cargando configuración:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "No fue posible cargar la configuración."
                );
            } finally {
                setCargando(false);
            }
        },
        []
    );

    useEffect(() => {
        cargarConfiguracion();
    }, [cargarConfiguracion]);

    function actualizarCampo<
        K extends keyof ConfiguracionGlobal
    >(
        campo: K,
        valor: ConfiguracionGlobal[K]
    ) {
        setConfiguracion(
            (configuracionActual) => ({
                ...configuracionActual,
                [campo]: valor,
            })
        );

        setError("");
        setMensaje("");
    }

    function manejarTexto(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } =
            event.target;

        actualizarCampo(
            name as keyof ConfiguracionGlobal,
            value
        );
    }

    async function guardarCambios() {
        try {
            setGuardando(true);
            setError("");
            setMensaje("");

            const response = await fetch(
                "/api/master/configuracion",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        companyName:
                            configuracion.companyName,

                        companyPhone:
                            configuracion.companyPhone,

                        companyEmail:
                            configuracion.companyEmail,

                        companyWebsite:
                            configuracion.companyWebsite,

                        logo:
                            configuracion.logo,

                        primaryColor:
                            configuracion.primaryColor,

                        secondaryColor:
                            configuracion.secondaryColor,

                        autoplay:
                            configuracion.autoplay,

                        seconds:
                            configuracion.seconds,

                        transitionEffect:
                            configuracion.transitionEffect,

                        auraTouchTimeout:
                            configuracion.auraTouchTimeout,

                        keyboardEnabled:
                            configuracion.keyboardEnabled,

                        refreshInterval:
                            configuracion.refreshInterval,

                        maintenanceMode:
                            configuracion.maintenanceMode,
                    }),
                }
            );

            const responseText =
                await response.text();

            if (!responseText.trim()) {
                throw new Error(
                    "La API respondió sin contenido."
                );
            }

            const result = JSON.parse(
                responseText
            ) as {
                success: boolean;
                data?: ConfiguracionGlobal;
                error?: string;
            };

            if (
                !response.ok ||
                !result.success ||
                !result.data
            ) {
                throw new Error(
                    result.error ??
                        "No fue posible guardar la configuración."
                );
            }

            setConfiguracion({
                ...CONFIGURACION_INICIAL,
                ...result.data,

                companyPhone:
                    result.data.companyPhone ??
                    "",

                companyEmail:
                    result.data.companyEmail ??
                    "",

                companyWebsite:
                    result.data.companyWebsite ??
                    "",

                logo:
                    result.data.logo ?? "",
            });

            setMensaje(
                "La configuración fue guardada correctamente."
            );

            window.setTimeout(() => {
                setMensaje("");
            }, 4000);
        } catch (error) {
            console.error(
                "Error guardando configuración:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "No fue posible guardar la configuración."
            );
        } finally {
            setGuardando(false);
        }
    }

    if (cargando) {
        return (
            <div className="flex min-h-[420px] items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <svg
                        className="h-6 w-6 animate-spin"
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

                    Cargando configuración...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Encabezado */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">
                        Configuración del Sistema
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Administre los parámetros globales,
                        la apariencia y las preferencias
                        operativas de Aura.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={guardarCambios}
                    disabled={guardando}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {guardando ? (
                        <>
                            <svg
                                className="h-5 w-5 animate-spin"
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

                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>

                            Guardar cambios
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
                >
                    {error}
                </div>
            )}

            {mensaje && (
                <div
                    role="status"
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700"
                >
                    {mensaje}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Apariencia */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-5">
                        <h4 className="flex items-center gap-2 font-bold text-slate-800">
                            <svg
                                className="h-5 w-5 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                />
                            </svg>

                            Apariencia y Marca
                        </h4>
                    </div>

                    <div className="space-y-5 p-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Nombre de la organización
                            </label>

                            <input
                                name="companyName"
                                type="text"
                                value={
                                    configuracion.companyName
                                }
                                onChange={manejarTexto}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Color primario
                                </label>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={
                                            configuracion.primaryColor
                                        }
                                        onChange={(event) =>
                                            actualizarCampo(
                                                "primaryColor",
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="h-10 w-12 cursor-pointer rounded border border-slate-200 bg-white p-1"
                                    />

                                    <input
                                        type="text"
                                        value={
                                            configuracion.primaryColor
                                        }
                                        onChange={(event) =>
                                            actualizarCampo(
                                                "primaryColor",
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Color secundario
                                </label>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={
                                            configuracion.secondaryColor
                                        }
                                        onChange={(event) =>
                                            actualizarCampo(
                                                "secondaryColor",
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="h-10 w-12 cursor-pointer rounded border border-slate-200 bg-white p-1"
                                    />

                                    <input
                                        type="text"
                                        value={
                                            configuracion.secondaryColor
                                        }
                                        onChange={(event) =>
                                            actualizarCampo(
                                                "secondaryColor",
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                URL del logotipo
                            </label>

                            <input
                                name="logo"
                                type="text"
                                value={
                                    configuracion.logo ?? ""
                                }
                                onChange={manejarTexto}
                                placeholder="/imagenes/logo_jr.png"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-5">
                        <h4 className="font-bold text-slate-800">
                            Información institucional
                        </h4>
                    </div>

                    <div className="space-y-5 p-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Teléfono
                            </label>

                            <input
                                name="companyPhone"
                                type="text"
                                value={
                                    configuracion.companyPhone ??
                                    ""
                                }
                                onChange={manejarTexto}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Correo electrónico
                            </label>

                            <input
                                name="companyEmail"
                                type="email"
                                value={
                                    configuracion.companyEmail ??
                                    ""
                                }
                                onChange={manejarTexto}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Sitio web
                            </label>

                            <input
                                name="companyWebsite"
                                type="text"
                                value={
                                    configuracion.companyWebsite ??
                                    ""
                                }
                                onChange={manejarTexto}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Pantallas */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-5">
                        <h4 className="font-bold text-slate-800">
                            Parámetros de Pantallas
                        </h4>
                    </div>

                    <div className="space-y-5 p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tiempo base de fotografías
                                </label>

                                <select
                                    value={
                                        configuracion.seconds
                                    }
                                    onChange={(event) =>
                                        actualizarCampo(
                                            "seconds",
                                            Number(
                                                event.target
                                                    .value
                                            )
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
                                >
                                    <option value={5}>
                                        5 segundos
                                    </option>

                                    <option value={10}>
                                        10 segundos
                                    </option>

                                    <option value={15}>
                                        15 segundos
                                    </option>

                                    <option value={30}>
                                        30 segundos
                                    </option>

                                    <option value={60}>
                                        60 segundos
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Transición global
                                </label>

                                <select
                                    value={
                                        configuracion.transitionEffect
                                    }
                                    onChange={(event) =>
                                        actualizarCampo(
                                            "transitionEffect",
                                            event.target
                                                .value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
                                >
                                    <option value="fade">
                                        Difuminado
                                    </option>

                                    <option value="slide">
                                        Deslizamiento
                                    </option>

                                    <option value="zoom">
                                        Zoom suave
                                    </option>
                                </select>
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    configuracion.autoplay
                                }
                                onChange={(event) =>
                                    actualizarCampo(
                                        "autoplay",
                                        event.target
                                            .checked
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-blue-600"
                            />

                            <div>
                                <span className="block text-sm font-bold text-slate-700">
                                    Reproducción automática
                                </span>

                                <span className="block text-xs text-slate-500">
                                    Iniciar automáticamente las presentaciones.
                                </span>
                            </div>
                        </label>

                        <div>
                            <label className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                                Intervalo de refresco

                                <span>
                                    {
                                        configuracion.refreshInterval
                                    }
                                    s
                                </span>
                            </label>

                            <input
                                type="range"
                                min="3"
                                max="60"
                                value={
                                    configuracion.refreshInterval
                                }
                                onChange={(event) =>
                                    actualizarCampo(
                                        "refreshInterval",
                                        Number(
                                            event.target
                                                .value
                                        )
                                    )
                                }
                                className="w-full accent-blue-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Aura Touch */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-5">
                        <h4 className="font-bold text-slate-800">
                            Configuración Aura Touch
                        </h4>
                    </div>

                    <div className="space-y-5 p-6">
                        <div>
                            <label className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                                Retorno automático al inicio

                                <span>
                                    {
                                        configuracion.auraTouchTimeout
                                    }
                                    s
                                </span>
                            </label>

                            <input
                                type="range"
                                min="30"
                                max="600"
                                step="10"
                                value={
                                    configuracion.auraTouchTimeout
                                }
                                onChange={(event) =>
                                    actualizarCampo(
                                        "auraTouchTimeout",
                                        Number(
                                            event.target
                                                .value
                                        )
                                    )
                                }
                                className="w-full accent-violet-600"
                            />
                        </div>

                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    configuracion.keyboardEnabled
                                }
                                onChange={(event) =>
                                    actualizarCampo(
                                        "keyboardEnabled",
                                        event.target
                                            .checked
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-violet-600"
                            />

                            <div>
                                <span className="block text-sm font-bold text-slate-700">
                                    Teclado virtual
                                </span>

                                <span className="block text-xs text-slate-500">
                                    Mostrar el teclado virtual al enfocar campos.
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Sistema */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-5">
                        <h4 className="font-bold text-slate-800">
                            Opciones avanzadas
                        </h4>
                    </div>

                    <div className="p-6">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    configuracion.maintenanceMode
                                }
                                onChange={(event) =>
                                    actualizarCampo(
                                        "maintenanceMode",
                                        event.target
                                            .checked
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-red-600"
                            />

                            <div>
                                <span className="block text-sm font-bold text-slate-700">
                                    Modo mantenimiento
                                </span>

                                <span className="block text-xs text-slate-500">
                                    Esta opción debe utilizarse con precaución.
                                    Posteriormente conectaremos esta configuración
                                    con el acceso público de pantallas y Aura Touch.
                                </span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}