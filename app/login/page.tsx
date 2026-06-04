"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Normalizamos el correo para evitar errores por espacios o mayúsculas
        const emailVal = email.toLowerCase().trim();
        
        // Verificación inteligente de roles
        if (emailVal.includes("master")) {
            router.push("/master"); 
        } else if (emailVal.includes("admin")) {
            router.push("/proyectar");
        } else {
            alert("Credenciales inválidas. Intenta con admin@... o master@...");
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

                    <form onSubmit={handleLogin} className="w-full space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Correo Electrónico</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/60 border-2 border-white focus:border-blue-400 p-4 rounded-xl text-slate-800 font-medium outline-none transition-all shadow-inner placeholder-slate-400" placeholder="ejemplo@jardinesdelrenacer.co" required />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Contraseña</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/60 border-2 border-white focus:border-blue-400 p-4 rounded-xl text-slate-800 font-medium outline-none transition-all shadow-inner placeholder-slate-400" placeholder="••••••••" required />
                        </div>

                        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm">
                            Ingresar al Sistema
                        </button>
                    </form>

                    <div className="mt-8 text-center bg-white/50 p-4 rounded-xl border border-white/60 text-xs text-slate-500 font-medium">
                        <p className="mb-1">Prueba con:</p>
                        <p><strong className="text-blue-600">admin@jardines.co</strong> (Sede) o <strong className="text-blue-600">master@jardines.co</strong> (Control)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}