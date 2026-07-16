"use client";

import Image from "next/image";

interface WelcomeScreenProps {
    onStart: () => void;
}

export default function WelcomeScreen({
    onStart,
}: WelcomeScreenProps) {
    return (
        <main className="min-h-screen bg-cover bg-center flex items-center justify-center p-12">
            <div className="w-full max-w-5xl rounded-[40px] bg-white/75 backdrop-blur-xl shadow-2xl p-20 text-center">
                <Image src="/imagenes/logo_jr.png" alt="Jardines del Renacer" width={130} height={130} className="mx-auto" />

                <h1 className="mt-8 text-6xl font-bold text-slate-800">
                    Jardines del Renacer
                </h1>

                <h2 className="mt-4 text-2xl uppercase tracking-[0.35em] text-blue-700 font-semibold">
                    Condolencias Digitales
                </h2>

                <div className="mt-10 text-2xl leading-relaxed text-slate-800 max-w-3xl mx-auto">
                    Un mensaje sincero puede convertirse en un recuerdo que acompañe a la familia para siempre.
                </div>

                <button onClick={onStart} className="mt-16 px-24 py-6 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 text-white text-2xl font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95">
                    Comenzar
                </button>
                
                <p className="mt-8 text-slate-400">
                    Toque el botón para comenzar.
                </p>
            </div>
        </main>
    );
}