"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegistrarDisplayClient() {

    const params = useSearchParams();

    const [codigo, setCodigo] = useState("");

    const [nombre, setNombre] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [mostrarCodigoManual, setMostrarCodigoManual] = useState(false);

    const [codigoDesdeQR, setCodigoDesdeQR] = useState(false); 

    useEffect(() => {

        const codigoURL = params.get("codigo");
        if (codigoURL) {
            setCodigo(codigoURL);
            setCodigoDesdeQR(true);
        }
    }, [params]);

    const registrar = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/pantalla/registrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ codigo, nombre, screen: { 
                    width: window.screen.width, height: window.screen.height }, 
                    viewport: { width: window.innerWidth, height: window.innerHeight }, 
                    userAgent: navigator.userAgent, language: navigator.language, online: navigator.onLine })
            });

            const result = await response.json();

            console.log("RESULTADO COMPLETO:", result);
            console.log("PRESENTACION:", result.presentacionId);

            if (!result.success) {
                setError(result.error);
                return;
            }

            window.location.href= `/display/${result.presentacionId}`;
        } catch (error) {
            console.error("Error al registrar pantalla:", error);
            setError("Error al registrar pantalla");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">

            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10">

                <h1 className="text-3xl font-black text-center">
                    Registrar Pantalla
                </h1>

                <p className="text-center text-slate-500 mt-2">
                    Vincule esta pantalla a una sede.
                </p>

                <div className="mt-8">

                    <label className="text-sm font-bold">
                        Nombre de la pantalla
                    </label>

                    <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                        placeholder="Ej: Sala Principal"
                    />

                </div>

                <div className="mt-6">

                    <label className="text-sm font-bold">
                        Código de Registro
                    </label>

                    {codigoDesdeQR ? (
                        <div className="mt-2 rounded 2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                            <p className="text-xs uppercase text-emerald-700 font-bold">
                                Código recibido
                            </p>

                            <span className="text-4xl font-black tracking-widest text-emerald-700">
                                {codigo}
                            </span>
                        </div>
                    ) : (
                        <>
                            {!mostrarCodigoManual ? (
                                <div className="mt-4">
                                    <div className="rounded 2xl border border-dashed border-slate-300 p-6 text-center">
                                        <p className="text-slate-500">
                                            No se detecto un código QR
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => setMostrarCodigoManual(true)}
                                            className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-slate-800 transition"
                                        >
                                            Ingresar código manualmente
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                
                                <div className="mt-4">
                                    <input
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                        placeholder="ABCD-1234"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-4 text-center text-2xl tracking-widest font-black uppercase"
                                    />

                                    <p className="mt-3 text-sm text-slate-500 text-center">
                                        Solicite este código al administrador o al usuario Master.
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                </div>

                {error && (

                    <div className="mt-5 rounded-xl bg-red-100 border border-red-300 p-4 text-red-700">

                        {error}

                    </div>

                )}

                <button
                    onClick={registrar}
                    disabled={loading || !nombre || !codigo}
                    className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-4 rounded-2xl font-bold text-lg"
                >

                    {loading
                        ? "Registrando..."
                        : "Registrar Pantalla"}

                </button>

            </div>

        </div>
    );
}






