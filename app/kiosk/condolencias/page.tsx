"use client";

import { useEffect, useState } from 'react';

import WelcomeScreen from "./screens/WelcomeScreen";
import SelectObituaryScreen from './screens/SelectObituaryScreen';
import FormScreen from "./screens/FormScreen";
import ThanksScreen from "./screens/ThanksScreen";
import { Obituary } from '@/src/types/obituary';

export default function KioskCondolencias() {

    type Screen = "welcome" | "select" | "form" | "thanks";

    const [screen, setScreen] = useState<Screen>("welcome");

    // const [screen, setScreen] = useState<"welcome" | "select" | "form" | "thanks">("welcome");

    const [selectedObituary, setSelectedObituary] = useState<Obituary | null>(null);
    
    useEffect(() => {
        if (screen === "thanks") {
            const timer = setTimeout(() => {
                setSelectedObituary(null);
                setScreen("welcome");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    return (
        //<main className="min-h-screen bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
        <main className="relative min-h-screen overflow-hidden bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center bg-no-repeat">
                       
            {/* Contenido */}
            <div className="relative z-10 min-h-screen">
                {/* Bienvenida */}
                {screen === "welcome" && (<WelcomeScreen onStart={() => setScreen("select")} /> )}
                
                {/* Selecionar sala*/}
                {/* {screen === "select" && (<SelectObituaryScreen onSelect={(obituary) => {setSelectedObituary(obituary); setScreen("form");}} />)} */}
                {screen === "select" && (<SelectObituaryScreen onSelect={(obituary) => {
                    console.log("Obituario Seleccionado:", obituary);
                    setSelectedObituary(obituary);
                    console.log("Cambiando a form");
                    setScreen("form"); 
                }}/>)}
                
                {/* Formulario */}    
                {screen === "form" && (<FormScreen obituary={selectedObituary} onSuccess={() => setScreen("thanks")} /> )}

                {/* {screen === "form" && selectedObituary && (<FormScreen obituary={selectedObituary} onSuccess={() => setScreen("thanks")} /> )} */}

                {/* Agradecimiento */}
                {screen === "thanks" && (<ThanksScreen /> )}
            </div>
        </main>
    );
}