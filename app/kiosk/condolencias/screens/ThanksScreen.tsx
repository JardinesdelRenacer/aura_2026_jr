"use client";

import Image from "next/image";

export default function ThanksScreen() {
    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-12">
            <div className="w-full max-w-5xl rounded-[40px] bg-white/75 backdrop-blur-xl shadow-2xl p-20 text-center">
                {/* Logo */}
                <Image src="/imagenes/logo_jr.png" alt="Jardines del Renacer" width={120} height={120} className="mx-auto object-contain" />

                {/* Linea */}
                <div className="mt-8 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

                {/* Check */}
                <div className="mt-12 mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100">
                    <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 7" />
                    </svg>
                </div>
                
                {/* titulo */}
                <h1 className="mt-8 text-5xl font-bold text-slate-600">
                    Muchas gracias
                </h1>

                {/* Descripción */}
                <p className="mt-6 text-2xl leading-relaxed text-slate-600 max-w-3xl mx-auto">
                    Su mensaje ha sido registrado correctamente.
                </p>

                <p className="mt-6 text-lg leading-relaxed text-slate-500 max-w-3xl mx-auto">
                    Gracias por acompañar a la familia con sus palabras de apoyo.
                </p>

                <div className="w-full max-w-5xl rounded-[40px] bg-white/75 backdrop-blur-xl shadow-2xl p-20 text-center" />
            </div>
        </div>
    );
}