"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useCallback } from "react";
import Slideshow from "@/components/Slideshow";

type Obituary = { name: string, surname: string, dob: string, dod: string, timeStart: string, timeEnd: string, cemetery: string, endTime?: string, endDate?: string };
type ObituariesData = {
    VIP: Obituary;
    SALA_1: Obituary;
    SALA_2: Obituary;
    SALA_3: Obituary;
};

export default function Pantalla() {

    const [media, setMedia] = useState<{url: string, type: string}[]>([]);

    const [autoPlay, setAutoplay] = useState(true);

    const [seconds, setSeconds] = useState(10);

    const [selectedImage, setSelectedImage] = useState(0);

    const [transitionEffect, setTransitionEffect] = useState("fade");

    const [projectionMode, setProjectionMode] = useState("classic");

    const [obituaries, setObituaries] = useState<ObituariesData | null>(null);
    const [showObituaries, setShowObituaries] = useState(true);

    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 10000); // Revisa cada 10 segundos
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadData = () => {
            const data = localStorage.getItem("presentacion");
            if (!data) return;
            
            const parsed = JSON.parse(data);
            setMedia(parsed.media || []);
            setAutoplay(parsed.autoPlay);
            setSeconds(parsed.seconds);
            setSelectedImage(parsed.selectedImage ?? 0);
            setTransitionEffect(parsed.transitionEffect || "fade");
            setProjectionMode(parsed.projectionMode || "classic");
            setObituaries(parsed.obituaries || null);
        };

        // Carga inicial
        loadData();

        // Escuchar cambios en tiempo real desde el Dashboard
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "presentacion") {
                loadData();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Lógica para alternar entre los Obituarios y las Imágenes a Pantalla Completa
    useEffect(() => {
        if (projectionMode === "split") return; // No alternar en modo dividido

        if (!autoPlay || media.length === 0) {
            setShowObituaries(true); // Forzar a obituarios si no hay imágenes
            return;
        }

        let timeoutId: NodeJS.Timeout;
        
        if (showObituaries) {
            timeoutId = setTimeout(() => {
                setShowObituaries(false);
            }, 30000);
        }

        return () => clearTimeout(timeoutId);
    }, [showObituaries, autoPlay, media.length, projectionMode]);

    // Formateador de fechas para que se vean más estéticas (ej: 25/12/2026)
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const parts = dateString.split("-");
        if(parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateString;
    };

    // Formateador de horas para que se vean AM/PM (ej: 14:00 -> 2:00 PM)
    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    // Valida si la hora actual ya superó la configurada en la sala
    const checkIsExpired = (endTime?: string, endDate?: string) => {
        if (!endTime || !currentTime) return false;
        
        const [hours, minutes] = endTime.split(':').map(Number);
        const end = new Date(currentTime);
        
        if (endDate) {
            const [year, month, day] = endDate.split('-').map(Number);
            end.setFullYear(year, month - 1, day);
        }
        
        end.setHours(hours, minutes, 0, 0);
        return currentTime > end;
    };

    const handleCompleteCycle = useCallback(() => {
        setShowObituaries(true);
    }, []);

    if (!obituaries) return <div className="w-screen h-screen bg-blue-50 flex items-center justify-center text-blue-800 font-bold text-2xl">Cargando presentación...</div>;

    // RENDERIZADO EN MODO PANTALLA DIVIDIDA (L + PUBLICIDAD)
    if (projectionMode === "split") {
        return (
            <div className="w-screen h-screen bg-blue-50 overflow-hidden relative font-sans">
                <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-6 p-6 bg-gradient-to-br from-white/60 via-blue-50/50 to-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.9),_0_8px_32px_rgba(0,0,0,0.1)]">
                    {/* Media Slider en Top Right */}
                    <div className="col-start-2 col-span-2 row-start-1 min-h-0 min-w-0 h-full w-full rounded-[2rem] overflow-hidden relative shadow-2xl border border-white/80 bg-white/40">
                        <div className="absolute inset-0">
                            <Slideshow media={media} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} transitionEffect={transitionEffect} />
                        </div>
                    </div>

                    {/* Obituarios en Forma de L */}
                    {Object.entries(obituaries)
                        .map(([roomKey, ob]) => {
                            const expired = checkIsExpired(ob.endTime, ob.endDate);
                            const isActive = Boolean((ob.name || ob.surname) && !expired);
                            return { roomKey, ob, isActive };
                        })
                        .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                        .map(({ roomKey, ob, isActive }, index) => {
                            const slotClasses = ["col-start-1 row-start-1", "col-start-1 row-start-2", "col-start-2 row-start-2", "col-start-3 row-start-2"];
                            return (
                                <div key={roomKey} className={`${slotClasses[index]} min-h-0 min-w-0 h-full w-full bg-[url('/imagenes/fondo_obituarios.png')] bg-[length:100%_100%] bg-no-repeat border border-white/20 rounded-[2rem] p-6 flex flex-col justify-start items-center text-center shadow-2xl relative overflow-hidden`}>
                                    <div className="absolute inset-0 p-6 flex flex-col justify-start items-center text-center">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-bl-full blur-3xl"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/30 rounded-tr-full blur-3xl"></div>

                                        <h2 className="text-2xl xl:text-3xl font-bold text-black mb-4 tracking-[0.2em] uppercase border-b border-black/20 pb-2 w-3/4 [text-shadow:_0_1px_5px_rgb(255_255_255)]">
                                            {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                                        </h2>
                                        
                                        {isActive ? (
                                            <div className="flex flex-col flex-grow w-full justify-center items-center z-10 overflow-hidden">
                                                <h3 className="text-3xl xl:text-4xl font-extrabold text-black mb-2 truncate w-full px-2 [text-shadow:_0_1px_5px_rgb(255_255_255)]">{ob.name}</h3>
                                                <h3 className="text-2xl xl:text-3xl font-bold text-black/90 mb-6 truncate w-full px-2 [text-shadow:_0_1px_5px_rgb(255_255_255)]">{ob.surname}</h3>
                                                
                                                {(ob.dob || ob.dod) && (
                                                    <div className="flex items-center gap-2 xl:gap-4 text-base xl:text-xl font-medium text-black mb-6 bg-white/40 px-4 xl:px-6 py-2 rounded-full border border-black/10 shadow-lg backdrop-blur-sm whitespace-nowrap overflow-hidden">
                                                        <span className="truncate">Nac: {formatDate(ob.dob)}</span>
                                                        <span className="text-black/50">|</span>
                                                        <span className="truncate">Fall: {formatDate(ob.dod)}</span>
                                                    </div>
                                                )}

                                                <div className="mt-auto grid grid-cols-2 gap-2 xl:gap-4 w-full">
                                                    {(ob.timeStart || ob.timeEnd) && (
                                                        <div className="bg-white/30 border border-black/10 rounded-2xl p-2 xl:p-4 backdrop-blur-md shadow-xl flex flex-col justify-center overflow-hidden">
                                                            <p className="text-black/80 text-xs xl:text-sm uppercase tracking-widest mb-1 font-bold [text-shadow:_0_1px_3px_rgb(255_255_255)] truncate">Horario</p>
                                                            <p className="text-sm xl:text-xl font-bold text-black [text-shadow:_0_1px_5px_rgb(255_255_255)] truncate">
                                                                {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {ob.cemetery && (
                                                        <div className="bg-white/30 border border-black/10 rounded-2xl p-2 xl:p-4 backdrop-blur-md shadow-xl flex flex-col justify-center overflow-hidden">
                                                            <p className="text-black/80 text-xs xl:text-sm uppercase tracking-widest mb-1 font-bold [text-shadow:_0_1px_3px_rgb(255_255_255)] truncate">Destino</p>
                                                            <p className="text-sm xl:text-xl font-bold text-black leading-tight truncate w-full px-1 [text-shadow:_0_1px_5px_rgb(255_255_255)]" title={ob.cemetery}>{ob.cemetery}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-grow flex items-center justify-center z-10">
                                                <p className="text-xl xl:text-2xl font-bold text-black/40 tracking-widest uppercase [text-shadow:_0_1px_5px_rgb(255_255_255)] truncate">Sala Disponible</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }

    // RENDERIZADO EN MODO CLÁSICO (ALTERNADO)
    return (
        <div className="w-screen h-screen bg-blue-50 overflow-hidden relative font-sans">
            {showObituaries ? (
                // Contenedor de Obituarios - Dividido en 4 (2x2)
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-6 p-6 bg-gradient-to-br from-white/60 via-blue-50/50 to-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.9),_0_8px_32px_rgba(0,0,0,0.1)]">
                    {Object.entries(obituaries)
                        .map(([roomKey, ob]) => {
                            const expired = checkIsExpired(ob.endTime, ob.endDate);
                            const isActive = Boolean((ob.name || ob.surname) && !expired);
                            return { roomKey, ob, isActive };
                        })
                        .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                        .map(({ roomKey, ob, isActive }) => (
                        <div key={roomKey} className="bg-[url('/imagenes/fondo_obituarios.png')] bg-[length:100%_100%] bg-no-repeat border border-white/20 rounded-[2rem] p-8 flex flex-col justify-start items-center text-center shadow-2xl relative overflow-hidden">
                            {/* Brillos 3D Glassmorphism decorativos */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/30 rounded-bl-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/30 rounded-tr-full blur-3xl"></div>

                            <h2 className="text-3xl font-bold text-black mb-8 tracking-[0.2em] uppercase border-b border-black/20 pb-2 w-3/4 [text-shadow:_0_1px_5px_rgb(255_255_255)]">
                                {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                            </h2>
                            
                            {isActive ? (
                                <div className="flex flex-col flex-grow w-full justify-center items-center z-10">
                                    <h3 className="text-5xl font-extrabold text-black mb-3 [text-shadow:_0_1px_5px_rgb(255_255_255)]">{ob.name}</h3>
                                    <h3 className="text-4xl font-bold text-black/90 mb-8 [text-shadow:_0_1px_5px_rgb(255_255_255)]">{ob.surname}</h3>
                                    
                                    {(ob.dob || ob.dod) && (
                                        <div className="flex items-center gap-4 text-2xl font-medium text-black mb-10 bg-white/40 px-8 py-3 rounded-full border border-black/10 shadow-lg backdrop-blur-sm">
                                            <span>Nac: {formatDate(ob.dob)}</span>
                                            <span className="text-black/50">|</span>
                                            <span>Fall: {formatDate(ob.dod)}</span>
                                        </div>
                                    )}

                                    <div className="mt-auto grid grid-cols-2 gap-4 w-full">
                                        {(ob.timeStart || ob.timeEnd) && (
                                            <div className="bg-white/30 border border-black/10 rounded-2xl p-4 backdrop-blur-md shadow-xl">
                                                <p className="text-black/80 text-sm uppercase tracking-widest mb-1 font-bold [text-shadow:_0_1px_3px_rgb(255_255_255)]">Horario del Servicio</p>
                                                <p className="text-2xl font-bold text-black [text-shadow:_0_1px_5px_rgb(255_255_255)]">
                                                    {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                </p>
                                            </div>
                                        )}
                                        {ob.cemetery && (
                                            <div className="bg-white/30 border border-black/10 rounded-2xl p-4 backdrop-blur-md shadow-xl">
                                                <p className="text-black/80 text-sm uppercase tracking-widest mb-1 font-bold [text-shadow:_0_1px_3px_rgb(255_255_255)]">Destino Final</p>
                                                <p className="text-2xl font-bold text-black leading-tight break-words px-2 [text-shadow:_0_1px_5px_rgb(255_255_255)]" title={ob.cemetery}>{ob.cemetery}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center justify-center z-10">
                                    <p className="text-3xl font-bold text-black/40 tracking-widest uppercase [text-shadow:_0_1px_5px_rgb(255_255_255)]">Sala Disponible</p>
                                </div>
                            )}
                        </div>
                        ))}
                </div>
            ) : (
                <div className="w-full h-full">
                    <Slideshow media={media} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} onCompleteCycle={handleCompleteCycle} transitionEffect={transitionEffect}></Slideshow>
                </div>
            )}
        </div>
    );
}