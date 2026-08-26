"use client";

import { useCallback, useEffect, useState } from 'react';

// Importación de las Animaciones
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import WelcomeScreen from "./screens/WelcomeScreen";
import SelectObituaryScreen from './screens/SelectObituaryScreen';
import FormScreen from "./screens/FormScreen";
import ThanksScreen from "./screens/ThanksScreen";

import { Obituary } from '@/src/types/obituary';

type Screen = "welcome" | "select" | "form" | "thanks";

const screenOrder: Record<Screen, number> = {
    welcome: 0,
    select: 1,
    form: 2,
    thanks: 3,
};

export default function KioskCondolencias() {

    const [screen, setScreen] = useState<Screen>("welcome");

    const [previousScreen, setPreviousScreen] = useState<Screen>("welcome");

    const [selectedObituary, setSelectedObituary] = useState<Obituary | null>(null);

    const [sinServicios, setSinServicios] = useState(false);

    const reduceMotion = useReducedMotion();

    const direction = screenOrder[screen] >= screenOrder[previousScreen] ? 1 : -1;

    useEffect(() => {
        const enviarHeartbeat = () => {
            fetch("/api/aura-touch/heartbeat", {
                method: "POST",
                credentials: "include",
            }).catch(() => {
                // La disponibilidad se vuelve a comprobar en el siguiente ciclo.
            });
        };

        enviarHeartbeat();
        const interval = window.setInterval(enviarHeartbeat, 5000);

        return () => window.clearInterval(interval);
    }, []);

    const cambiarPantalla = (nextScreen: Screen) => {
        setPreviousScreen(screen);
        setScreen(nextScreen);
    };

    const informarSinServicios = useCallback(() => {
        setSinServicios(true);
    }, []);

    useEffect(() => {
        if (!sinServicios) return;

        const timer = window.setTimeout(() => {
            setSelectedObituary(null);
            setPreviousScreen("select");
            setScreen("welcome");
            setSinServicios(false);
        }, 3500);

        return () => window.clearTimeout(timer);
    }, [sinServicios]);
    
    useEffect(() => {
        if (screen !== "thanks") return;

        const timer = window.setTimeout(() => {
            setSelectedObituary(null);
            setPreviousScreen("thanks");
            setScreen("welcome");
        }, 5000);

            return () => {
                window.clearTimeout(timer);
            };
    }, [screen]);

    return (

        <main className="relative min-h-screen overflow-x-hidden bg-[url('/imagenes/fondo-aura-touch.png')] bg-cover bg-center bg-no-repeat">

            {/* Capa decorativa */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-blue-50/10 to-sky-100/20" />

            <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-300/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-300/20 blur-3xl" />

            {/* Indicador de proceso0 */}

            {screen !== "welcome" &&
                screen !== "thanks" && (
                    <div className="absolute left-1/2 top-6 z-50 w-full max-w-md -translate-x-1/2 px-8">
                        <div className="flex gap-3">
                            {["select", "form"].map(
                                (step, index) => {
                                    const currentStep =
                                        screen === "select"
                                            ? 0
                                            : 1;

                                    return (
                                        <motion.div
                                            key={step}
                                            className={`h-2 flex-1 rounded-full ${
                                                index <= currentStep
                                                    ? "bg-blue-600"
                                                    : "bg-white/60"
                                            }`}
                                            initial={false}
                                            animate={{
                                                scaleX:
                                                    index <=
                                                    currentStep
                                                        ? 1
                                                        : 0.96,
                                                opacity:
                                                    index <=
                                                    currentStep
                                                        ? 1
                                                        : 0.6,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                            }}
                                        />
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}

            <div className="relative z-10 min-h-screen">
                <AnimatePresence
                    mode="wait"
                    initial={false}
                    custom={direction}
                >
                    <motion.section
                        key={screen}
                        custom={direction}
                        initial={
                            reduceMotion
                                ? { opacity: 0 }
                                : {
                                      opacity: 0,
                                      x:
                                          direction > 0
                                              ? 70
                                              : -70,
                                      scale: 0.985,
                                  }
                        }
                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                        }}
                        exit={
                            reduceMotion
                                ? { opacity: 0 }
                                : {
                                      opacity: 0,
                                      x:
                                          direction > 0
                                              ? -70
                                              : 70,
                                      scale: 0.985,
                                  }
                        }
                        transition={{
                            duration: reduceMotion
                                ? 0.15
                                : 0.38,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="min-h-screen"
                    >
                        {screen === "welcome" && (
                            <WelcomeScreen
                                onStart={() =>
                                    cambiarPantalla(
                                        "select"
                                    )
                                }
                            />
                        )}

                        {screen === "select" && (
                            <SelectObituaryScreen
                                onSelect={(
                                    obituary
                                ) => {
                                    setSelectedObituary(
                                        obituary
                                    );

                                    cambiarPantalla(
                                        "form"
                                    );
                                }}
                                onNoServices={informarSinServicios}
                            />
                        )}

                        {screen === "form" && (
                            <FormScreen
                                obituary={
                                    selectedObituary
                                }
                                onSuccess={() =>
                                    cambiarPantalla(
                                        "thanks"
                                    )
                                }
                            />
                        )}

                        {screen === "thanks" && (
                            <ThanksScreen />
                        )}
                    </motion.section>
                </AnimatePresence>
            </div>
        </main>
    );
}
            // No borar
//             {screen !== "welcome" &&
//                 screen !== "thanks" && (
//                     <div className="absolute left-1/2 top-6 z-50 w-full max-w-md -translate-x-1/2 px-8">
//                         <div className='flex gap-3'>
//                             {["select", "form"].map(
//                                 (step, index) => {
//                                     const currentStep = screen === "select" ? 0 : 1;

//                                     return (<motion.div key={step} className={'h-2 flex-1 rounded-full ${
//                                         index  <= currentStep ? "bg-blue-600" : "bg-white/60"}`}
//                                         initial={false}
//                                         animate={{scaleX: index <= currentStep ? 1 : 0.96, opacity: index <= currentStep ? 1 : 0.6, }} transtion={{ duration: 0.3 }} />
//                                     );
//                                 }
//                             )}
//                         </div>
//                     </div>
//                 )}
//             <div className="relative z-10 min-h-screen">
//                 <AnimatePresence mode="wait" inital={false} custom={direction}>
//                     <motion.section 
//                         key={screen} 
//                         custom={direction} 
//                         initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? 70 : -70, scale: 0.985}}
//                         animate={{opacity: 1, x: 0, scale: 1 }}
//                         exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? -70 : 70, scale: 0.985 }}
//                         transition={{duration: reduceMotion ? 0.15 : 0.38, ease: [0.22, 1, 0.36, 1]}}
//                         className="min-h-screen">
//                             {screen === "welcome" && (<WelcomeScreen onStart{() => cambiarPantalla("select")} />
//                         )}

//                         {screen === "select" && (
//                             <SelectObituaryScreen onSelect={(obituary) => { setSelectedObituary(obituary); cambiarPantalla("form"); }} />
//                         )}

//                         {screen === "form" && (
//                             <FormScreen obituary={selectedObituary} onSuccess={() => cambiarPantalla("thanks")} />
//                         )}

//                         {screen === "thanks" && (
//                             <ThanksScreen />
//                         )}
//                     </motion.section>
//                 </AnimatePresence>
//             </div>
//         </main>
//     );
// }
        



