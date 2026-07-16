"use client";

import { useEffect, useState } from 'react';

import WelcomeScreen from "./screens/WelcomeScreen";
import FormScreen from "./screens/FormScreen";
import ThanksScreen from "./screens/ThanksScreen";

export default function KioskCondolencias() {

    const [screen, setScreen] = useState<"welcome" | "form" | "thanks">("welcome");
    
    return (
        //<main className="min-h-screen bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
        <main className="relative min-h-screen overflow-hidden bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center bg-no-repeat">
                       
            {/* Contenido */}
            <div className="relative z-10 min-h-screen">
                {/* Pantalla de Carga */}
                {screen === "welcome" && (<WelcomeScreen onStart={() => setScreen("form")} /> )}
                    
                {screen === "form" && (<FormScreen onSuccess={() => setScreen("thanks")} /> )}

                {screen === "thanks" && (<ThanksScreen /> )}
            </div>
        </main>
    );
}