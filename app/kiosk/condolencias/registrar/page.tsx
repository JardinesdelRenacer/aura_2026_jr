"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
    CheckCircle2,
    KeyRound,
    Loader2,
    MonitorSmartphone,
    Tablet,
} from "lucide-react";

interface RegisterResponse {
    success: boolean;
    error?: string;
    data?: {
        id: string;
        nombre: string;
        sede?: {
            id: string;
            nombre: string;
        };
    };
}

export default function RegistrarAuraTouchPage() {
    const router = useRouter();

    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");

    const [registrando, setRegistrando] = useState(false);
    const [error, setError] = useState("");
    const [registroExitoso, setRegistroExitoso] =
        useState(false);
    const [verificandoRegistro, setVerificandoRegistro] = useState(true);
    const [dispositivoRegistrado, setDispositivoRegistrado] =
        useState<AuraTouchConfiguracion | null>(null);

    useEffect(() => {
        const verificarRegistroExistente = async () => {
            const controller = new AbortController();
            const timeout = window.setTimeout(
                () => controller.abort(),
                4000
            );

            try {
                const response = await fetch("/api/aura-touch/configuracion", {
                    credentials: "include",
                    cache: "no-store",
                    signal: controller.signal,
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    setDispositivoRegistrado(result.data);
                }
            } catch {
                // Sin cookie válida: se muestra el formulario de registro.
            } finally {
                window.clearTimeout(timeout);
                setVerificandoRegistro(false);
            }
        };

        verificarRegistroExistente();
    }, []);

    const codigoNormalizado = codigo
        .toUpperCase()
        .replace(/\s/g, "");

    const formularioValido =
        codigoNormalizado.length >= 4 &&
        nombre.trim().length >= 3;

    async function registrarTableta(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!formularioValido || registrando) {
            return;
        }

        try {
            setRegistrando(true);
            setError("");

            const response = await fetch(
                "/api/aura-touch/registrar",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        codigo: codigoNormalizado,
                        nombre: nombre.trim(),
                        userAgent:
                            window.navigator.userAgent,
                    }),
                }
            );

            const result =
                (await response.json()) as RegisterResponse;

            if (!response.ok || !result.success) {
                setError(
                    result.error ??
                        "No fue posible registrar la tableta."
                );
                return;
            }

            setRegistroExitoso(true);

            window.setTimeout(() => {
                router.replace(
                    "/kiosk/condolencias"
                );

                router.refresh();
            }, 1800);
        } catch (error) {
            console.error(
                "Error registrando Aura Touch:",
                error
            );

            setError(
                "No fue posible conectar con el servidor."
            );
        } finally {
            setRegistrando(false);
        }
    }

    if (verificandoRegistro) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
                <Loader2 className="mr-3 animate-spin" size={24} />
                Verificando dispositivo...
            </main>
        );
    }

    if (dispositivoRegistrado) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center p-6">
                <div className="absolute inset-0 bg-white/35 backdrop-blur-sm" />
                <section className="relative z-10 w-full max-w-xl rounded-[36px] border border-white/80 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12">
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100 text-emerald-600">
                        <CheckCircle2 size={46} />
                    </div>
                    <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-emerald-600">Dispositivo vinculado</p>
                    <h1 className="mt-3 text-3xl font-black text-slate-800 sm:text-4xl">Esta tableta ya está registrada</h1>
                    <p className="mt-5 text-lg leading-relaxed text-slate-600">La tableta <strong>{dispositivoRegistrado.auraTouch.nombre}</strong> está vinculada a la sede <strong>{dispositivoRegistrado.sede.nombre}</strong>.</p>
                    <button type="button" onClick={() => router.replace("/kiosk/condolencias")} className="mt-9 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 text-lg font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl">
                        <Tablet size={23} />
                        Abrir Aura Touch
                    </button>
                    <p className="mt-5 text-sm text-slate-400">No necesitas generar ni ingresar otro código.</p>
                </section>
            </main>
        );
    }

    if (registroExitoso) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center p-8">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

                <div className="relative z-10 w-full max-w-3xl rounded-[40px] border border-white/80 bg-white/85 p-16 text-center shadow-2xl backdrop-blur-2xl">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 size={62} />
                    </div>

                    <h1 className="mt-8 text-5xl font-black text-slate-800">
                        Tableta registrada
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-2xl leading-relaxed text-slate-600">
                        El dispositivo quedó vinculado
                        correctamente con su sede.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-3 text-lg font-semibold text-blue-700">
                        <Loader2
                            className="animate-spin"
                            size={24}
                        />

                        Abriendo Aura Touch...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center p-8">
            {/* Capa visual */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-50/20 to-sky-100/30 backdrop-blur-[2px]" />

            <div className="absolute -left-44 -top-44 h-[520px] w-[520px] rounded-full bg-blue-300/20 blur-3xl" />

            <div className="absolute -bottom-44 -right-44 h-[520px] w-[520px] rounded-full bg-sky-300/20 blur-3xl" />

            <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[44px] border border-white/80 bg-white/85 shadow-2xl backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]">
                {/* Panel izquierdo */}
                <section className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-sky-600 p-14 text-center text-white">
                    <Image
                        src="/imagenes/logo_jr.png"
                        alt="Jardines del Renacer"
                        width={125}
                        height={125}
                        priority
                        className="rounded-full bg-white p-2 shadow-xl"
                    />

                    <div className="mt-10 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/30 bg-white/15 shadow-xl backdrop-blur-md">
                        <Tablet size={48} />
                    </div>

                    <h1 className="mt-8 text-5xl font-black">
                        Aura Touch
                    </h1>

                    <p className="mt-5 max-w-md text-xl leading-relaxed text-blue-50">
                        Registre esta tableta para
                        vincularla con una sede y mostrar
                        únicamente sus servicios
                        funerarios.
                    </p>

                    <div className="mt-10 rounded-2xl border border-white/25 bg-white/10 px-6 py-5 text-left backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <MonitorSmartphone size={25} />

                            <p className="font-semibold">
                                Registro único por dispositivo
                            </p>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-blue-100">
                            El código debe ser generado
                            previamente desde el panel de
                            administración.
                        </p>
                    </div>
                </section>

                {/* Formulario */}
                <section className="flex items-center p-12 lg:p-16">
                    <form
                        onSubmit={registrarTableta}
                        className="w-full"
                    >
                        <div className="mb-10">
                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
                                Configuración inicial
                            </p>

                            <h2 className="mt-3 text-4xl font-black text-slate-800">
                                Registrar tableta
                            </h2>

                            <p className="mt-4 text-lg leading-relaxed text-slate-500">
                                Ingrese el nombre del
                                dispositivo y el código
                                entregado por el
                                administrador.
                            </p>
                        </div>

                        <div className="space-y-7">
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className="mb-3 block text-lg font-bold text-slate-700"
                                >
                                    Nombre del dispositivo
                                </label>

                                <div className="relative">
                                    <Tablet
                                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={24}
                                    />

                                    <input
                                        id="nombre"
                                        type="text"
                                        value={nombre}
                                        onChange={(event) =>
                                            setNombre(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="Ejemplo: Tableta recepción"
                                        disabled={registrando}
                                        autoComplete="off"
                                        className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-xl text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                                    />
                                </div>

                                <p className="mt-2 text-sm text-slate-400">
                                    Este nombre permitirá
                                    identificar la tableta en
                                    el panel administrativo.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="codigo"
                                    className="mb-3 block text-lg font-bold text-slate-700"
                                >
                                    Código de registro
                                </label>

                                <div className="relative">
                                    <KeyRound
                                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={24}
                                    />

                                    <input
                                        id="codigo"
                                        type="text"
                                        value={codigo}
                                        onChange={(event) => {
                                            setCodigo(
                                                event.target
                                                    .value
                                                    .toUpperCase()
                                                    .replace(
                                                        /\s/g,
                                                        ""
                                                    )
                                                    .slice(
                                                        0,
                                                        12
                                                    )
                                            );

                                            setError("");
                                        }}
                                        placeholder="Ejemplo: AURA4582"
                                        disabled={registrando}
                                        autoComplete="off"
                                        autoCapitalize="characters"
                                        spellCheck={false}
                                        className="h-20 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-center font-mono text-3xl font-black uppercase tracking-[0.25em] text-blue-700 outline-none transition placeholder:text-base placeholder:font-normal placeholder:tracking-normal focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-base font-semibold text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={
                                !formularioValido ||
                                registrando
                            }
                            className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-8 text-xl font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none"
                        >
                            {registrando ? (
                                <>
                                    <Loader2
                                        className="animate-spin"
                                        size={25}
                                    />

                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <Tablet size={25} />

                                    Registrar tableta
                                </>
                            )}
                        </button>

                        <p className="mt-6 text-center text-sm text-slate-400">
                            Esta configuración permanecerá
                            guardada en el dispositivo.
                        </p>
                    </form>
                </section>
            </div>
        </main>
    );
}

interface AuraTouchConfiguracion {
    auraTouch: { nombre: string };
    sede: { nombre: string };
}
