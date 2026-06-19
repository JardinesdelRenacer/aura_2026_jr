"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userAgent } from "next/server";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full bg-white/60 border-2 border-white focus:border-blue-400 p-4 rounded-xl text-slate-800 font-medium outline-none transition-all shadow-inner placeholder-slate-400" 
                                placeholder="••••••••" 
                                required 
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
                            disabled={loading}
                        >
                            {loading ? "Validando..." : "Ingresar al Sistema"}
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