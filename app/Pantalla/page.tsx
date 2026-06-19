"use client";


import { useEffect, useState, useCallback } from "react";
import Slideshow from "@/components/Slideshow";

type Obituary = { name: string, surname: string, dob: string, dod: string, timeStart: string, timeEnd: string, cemetery: string, endTime?: string, endDate?: string, massTime?: string, massChurch?: string, massChurchType?: string, massAddress?: string };
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

    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
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

        if (!autoPlay || media.length === 0 || !showObituaries) return;

        const timeoutId = setTimeout(() => {
            setShowObituaries(false);
        }, 30000);

        return () => clearTimeout(timeoutId);
    }, [showObituaries, autoPlay, media.length, projectionMode]);

    const isShowingObituaries = !autoPlay || media.length === 0 || showObituaries;

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
                <div className="w-full h-full p-4 sm:p-6 lg:p-8 bg-linear-to-br from-white/60 via-blue-50/50 to-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.1)]">
                    <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        {/* Media Slider en Top Right */}
                        <div className="col-start-2 col-span-2 row-start-1 min-h-0 min-w-0 h-full w-full rounded-4xl overflow-hidden relative shadow-2xl border border-white/80 bg-white/40">
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
                                    <div key={roomKey} className={`${slotClasses[index]} min-h-0 min-w-0 h-full w-full bg-[url('/imagenes/fondo_obituarios.png')] bg-size-[100%_100%] bg-no-repeat border border-white/20 rounded-4xl shadow-2xl relative overflow-hidden`}>
                                        <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-start items-center text-center">
                                            <div className="absolute top-0 right-0 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-white/30 rounded-bl-full blur-3xl"></div>
                                            <div className="absolute bottom-0 left-0 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-white/30 rounded-tr-full blur-3xl"></div>
                                            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-black mb-3 sm:mb-4 tracking-[0.2em] uppercase border-b border-black/20 pb-2 w-3/4 [text-shadow:0_1px_5px_rgb(255_255_255)]">
                                                {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                                            </h2>
                                            {isActive ? (
                                                <div className="flex flex-col grow w-full justify-center items-center z-10 overflow-hidden">
                                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-black mb-1 sm:mb-2 truncate w-full px-2 [text-shadow:0_1px_5px_rgb(255_255_255)]">{ob.name}</h3>
                                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black/90 mb-2 sm:mb-4 truncate w-full px-2 [text-shadow:0_1px_5px_rgb(255_255_255)]">{ob.surname}</h3>
                                                    {(ob.dob || ob.dod) && (
                                                        <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 text-sm sm:text-base lg:text-lg font-medium text-black mb-2 sm:mb-4 bg-white/40 px-3 sm:px-5 lg:px-6 py-1 sm:py-2 rounded-full border border-black/10 shadow-lg backdrop-blur-sm whitespace-nowrap overflow-hidden">
                                                            <span className="truncate">Nacimiento: {formatDate(ob.dob)}</span>
                                                            <span className="text-black/50 hidden sm:inline">|</span>
                                                            <span className="truncate">Fallecimiento: {formatDate(ob.dod)}</span>
                                                        </div>
                                                    )}

                                                    {(ob.massTime || ob.massChurch) && (
                                                        <div className="flex flex-col items-center justify-center gap-1 bg-white/40 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl border border-black/10 shadow-md backdrop-blur-sm mb-2 sm:mb-4 w-[95%] overflow-hidden">
                                                            <span className="text-[0.45rem] sm:text-[0.55rem] lg:text-[0.65rem] font-bold uppercase tracking-widest text-black/80">Eucaristía</span>
                                                            <span className="text-[0.65rem] sm:text-xs lg:text-sm font-bold text-black truncate w-full px-1">
                                                                {ob.massChurch ? `${ob.massChurchType || "Parroquia"}: ${ob.massChurch}` : (ob.massChurchType || "Parroquia")} {ob.massTime && `- ${formatTime(ob.massTime)}`}
                                                            </span>
                                                            {ob.massAddress && <span className="text-[0.55rem] sm:text-[0.65rem] lg:text-xs font-medium text-black/80 truncate w-full px-1">{ob.massAddress}</span>}
                                                        </div>
                                                    )}

                                                    <div className="mt-auto grid grid-cols-2 gap-1 sm:gap-3 lg:gap-4 w-full px-2">
                                                        {(ob.timeStart || ob.timeEnd) && (
                                                            <div className="bg-white/30 border border-black/10 rounded-xl sm:rounded-2xl p-1.5 lg:p-3 backdrop-blur-md shadow-xl flex flex-col justify-center overflow-hidden">
                                                                <p className="text-black/80 text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest mb-0.5 sm:mb-1 font-bold [text-shadow:0_1px_3px_rgb(255_255_255)] truncate">Horario</p>
                                                                <p className="text-xs sm:text-base lg:text-lg font-bold text-black [text-shadow:0_1px_5px_rgb(255_255_255)] truncate">
                                                                    {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {ob.cemetery && (
                                                            <div className="bg-white/30 border border-black/10 rounded-xl sm:rounded-2xl p-1.5 lg:p-3 backdrop-blur-md shadow-xl flex flex-col justify-center overflow-hidden">
                                                                <p className="text-black/80 text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest mb-0.5 sm:mb-1 font-bold [text-shadow:0_1px_3px_rgb(255_255_255)] truncate">Destino</p>
                                                                <p className="text-xs sm:text-base lg:text-lg font-bold text-black leading-tight truncate w-full px-1 [text-shadow:0_1px_5px_rgb(255_255_255)]" title={ob.cemetery}>{ob.cemetery}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grow flex items-center justify-center z-10">
                                                    <p className="text-base sm:text-xl lg:text-2xl font-bold text-black/40 tracking-widest uppercase [text-shadow:0_1px_5px_rgb(255_255_255)] truncate">Sala Disponible</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-blue-50 overflow-hidden relative font-sans">
            {isShowingObituaries ? (
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 p-3 sm:p-4 md:p-5 lg:p-6 bg-linear-to-br from-white/60 via-blue-50/50 to-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.1)]">
                    {Object.entries(obituaries)
                        .map(([roomKey, ob]) => {
                            const expired = checkIsExpired(ob.endTime, ob.endDate);
                            const isActive = Boolean((ob.name || ob.surname) && !expired);
                            return { roomKey, ob, isActive };
                        })
                        .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                        .map(({ roomKey, ob, isActive }) => (
                        <div key={roomKey} className="bg-[url('/imagenes/fondo_obituarios.png')] bg-size-[100%_100%] bg-no-repeat border border-white/20 rounded-2xl sm:rounded-3xl lg:rounded-4xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-start items-center text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 lg:w-48 h-16 sm:h-24 md:h-32 lg:h-48 bg-white/30 rounded-bl-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-16 sm:w-24 md:w-32 lg:w-48 h-16 sm:h-24 md:h-32 lg:h-48 bg-white/30 rounded-tr-full blur-3xl"></div>

                            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-black mb-2 sm:mb-4 md:mb-6 lg:mb-8 tracking-[0.2em] uppercase border-b border-black/20 pb-1 sm:pb-2 md:pb-2 lg:pb-2 w-3/4 [text-shadow:0_1px_5px_rgb(255_255_255)]">
                                {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                            </h2>
                            
                            {isActive ? (
                                <div className="flex flex-col grow w-full justify-center items-center z-10">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-black mb-1 sm:mb-2 md:mb-2 lg:mb-3 truncate w-full px-1 sm:px-2 [text-shadow:0_1px_5px_rgb(255_255_255)]">{ob.name}</h3>
                                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black/90 mb-2 sm:mb-4 md:mb-4 lg:mb-6 truncate w-full px-1 sm:px-2 [text-shadow:0_1px_5px_rgb(255_255_255)]">{ob.surname}</h3>
                                    
                                    {(ob.dob || ob.dod) && (
                                        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 text-xs sm:text-sm md:text-base lg:text-xl font-medium text-black mb-3 sm:mb-4 md:mb-6 lg:mb-8 bg-white/40 px-2 sm:px-4 md:px-6 lg:px-8 py-1 sm:py-2 md:py-2 lg:py-3 rounded-full border border-black/10 shadow-lg backdrop-blur-sm whitespace-nowrap overflow-hidden">
                                            <span className="truncate">Nacimiento: {formatDate(ob.dob)}</span>
                                            <span className="text-black/50 hidden sm:inline">|</span>
                                            <span className="truncate">Fallecimiento: {formatDate(ob.dod)}</span>
                                        </div>
                                    )}

                                    {(ob.massTime || ob.massChurch) && (
                                        <div className="flex flex-col items-center justify-center gap-1 bg-white/40 px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-2xl border border-black/10 shadow-xl backdrop-blur-sm mb-4 sm:mb-6 md:mb-8 w-[95%] overflow-hidden">
                                            <span className="text-[0.65rem] sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-widest text-black/80">Eucaristía</span>
                                            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black truncate w-full px-2">
                                                {ob.massChurch ? `${ob.massChurchType || "Parroquia"}: ${ob.massChurch}` : (ob.massChurchType || "Parroquia")} {ob.massTime && `- ${formatTime(ob.massTime)}`}
                                            </span>
                                            {ob.massAddress && <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-black/80 truncate w-full px-2">{ob.massAddress}</span>}
                                        </div>
                                    )}

                                    <div className="mt-auto grid grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4 w-full px-1 sm:px-2 md:px-3 lg:px-0">
                                        {(ob.timeStart || ob.timeEnd) && (
                                            <div className="bg-white/30 border border-black/10 rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 md:p-2 lg:p-3 backdrop-blur-md shadow-xl flex flex-col justify-center overflow-hidden">
                                                <p className="text-black/80 text-[10px] sm:text-xs md:text-sm lg:text-sm uppercase tracking-widest mb-0.5 sm:mb-1 md:mb-1 lg:mb-1 font-bold [text-shadow:0_1px_3px_rgb(255_255_255)] truncate">Horario</p>
                                                <p className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-black [text-shadow:0_1px_5px_rgb(255_255_255)] truncate">
                                                    {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                </p>
                                            </div>
                                        )}
                                        {ob.cemetery && (
                                            <div className="bg-white/30 border border-black/10 rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 md:p-2 lg:p-3 backdrop-blur-md shadow-xl flex flex-col justify-center overflow-hidden">
                                                <p className="text-black/80 text-[10px] sm:text-xs md:text-sm lg:text-sm uppercase tracking-widest mb-0.5 sm:mb-1 md:mb-1 lg:mb-1 font-bold [text-shadow:0_1px_3px_rgb(255_255_255)] truncate">Destino</p>
                                                <p className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-black leading-tight truncate w-full px-0 sm:px-1 md:px-1 lg:px-2 [text-shadow:0_1px_5px_rgb(255_255_255)]" title={ob.cemetery}>{ob.cemetery}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grow flex items-center justify-center z-10">
                                    <p className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-black/40 tracking-widest uppercase [text-shadow:0_1px_5px_rgb(255_255_255)] truncate">Sala Disponible</p>
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
