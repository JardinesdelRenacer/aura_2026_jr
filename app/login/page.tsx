"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Llamar al endpoint de autenticación
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    password,
                }),
            });

            // Manejo robusto: comprobar content-type antes de parsear JSON
            const contentType = response.headers.get("content-type") || "";
            let data: any = null;

            if (contentType.includes("application/json")) {
                try {
                    data = await response.json();
                } catch (err) {
                    setError("Respuesta inválida del servidor");
                    setLoading(false);
                    console.error('Invalid JSON response', err);
                    return;
                }
            } else {
                // Si el servidor devolvió HTML (p. ej. página de error), leer como texto
                const text = await response.text();
                setError("Error del servidor: respuesta inesperada");
                setLoading(false);
                console.error('Non-JSON response from /api/auth/login:', text);
                return;
            }

            if (!data || !data.success) {
                setError((data && data.error) || "Credenciales inválidas");
                setLoading(false);
                return;
            }

            // Guardar información del usuario en sessionStorage
            sessionStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.user.id,
                    email: data.user.email,
                    role: data.user.role,
                    sedeId: data.user.sedeId,
                })
            );

            // Redirigir según el rol
            if (data.user.role === "MASTER") {
                router.push("/master");
            } else if (data.user.role === "ADMIN") {
                router.push(`/proyectar/${data.user.sedeId}`);
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-bl-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-tr-full blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-blue-950 rounded-full flex items-center justify-center border-2 border-white shadow-lg p-2 mb-6">
                        <img src="/imagenes/logo-oficial.webp" alt="JR Logo" className="w-full h-full object-contain p-1.5" />
                    </div>
                    
                    <h1 className="text-3xl font-black text-slate-800 mb-2 text-center tracking-tight">Iniciar Sesión</h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 text-center">Aura 2026</p>

                    {error && (
                        <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="w-full space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Correo Electrónico</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full bg-white/60 border-2 border-white focus:border-blue-400 p-4 rounded-xl text-slate-800 font-medium outline-none transition-all shadow-inner placeholder-slate-400" 
                                placeholder="ejemplo@jardinesdelrenacer.co" 
                                required 
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Contraseña</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full bg-white/60 border-2 border-white focus:border-blue-400 p-4 rounded-xl text-slate-800 font-medium outline-none transition-all shadow-inner placeholder-slate-400 pr-12" 
                                    placeholder="••••••••" 
                                    required 
                                    disabled={loading}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-blue-600 transition-colors">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
                            disabled={loading}
                        >
                            {loading ? "Validando..." : "Ingresar al Sistema"}
                        </button>

                        <button
                            type="button"
                            onClick={() => window.location.href = "/display"}
                            className="w-full rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 hover:bg-slate-100 transition"
                        >
                            📺 Registrar Pantalla
                        </button>
                    </form>

                    <div className="mt-8 text-center bg-white/50 p-4 rounded-xl border border-white/60 text-xs text-slate-500 font-medium">
                        <p className="mb-2 font-bold text-slate-700">Credenciales de Prueba:</p>
                        <div className="space-y-2">
                            <div>
                                <p className="text-slate-600"><strong className="text-blue-600">MASTER:</strong> master@jardines.co</p>
                                <p className="text-slate-600"><strong className="text-blue-600">ADMIN:</strong> admin@jardines.co</p>
                                <p className="text-slate-600 mt-1"><strong>Contraseña:</strong> 123456</p>
                            </div>
                    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}