"use client";

import { useEffect, useState } from "react";
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
    }, [showObituaries, autoPlay, media.length]);

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

    if (!obituaries) return <div className="w-screen h-screen bg-black flex items-center justify-center text-white text-2xl">Cargando presentación...</div>;

    return (
        <div className="w-screen h-screen bg-black overflow-hidden relative font-sans">
            {showObituaries ? (
                // Contenedor de Obituarios - Dividido en 4 (2x2)
                // NOTA: Aquí puedes reemplazar el bg-gradient con tu imagen de fondo:
                // Ejemplo: className="w-full h-full grid... bg-[url('/ruta-de-tu-fondo.jpg')] bg-cover bg-center"
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-6 p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
                    {Object.entries(obituaries)
                        .map(([roomKey, ob]) => {
                            const expired = checkIsExpired(ob.endTime, ob.endDate);
                            const isActive = Boolean((ob.name || ob.surname) && !expired);
                            return { roomKey, ob, isActive };
                        })
                        .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                        .map(({ roomKey, ob, isActive }) => (
                        <div key={roomKey} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 flex flex-col justify-start items-center text-center shadow-2xl relative overflow-hidden">
                            {/* Brillos 3D Glassmorphism decorativos */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/20 rounded-bl-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-tr-full blur-3xl"></div>

                            <h2 className="text-3xl font-bold text-blue-300 mb-8 tracking-[0.2em] uppercase border-b border-white/20 pb-2 w-3/4">
                                {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                            </h2>
                            
                            {isActive ? (
                                <div className="flex flex-col flex-grow w-full justify-center items-center z-10">
                                    <h3 className="text-5xl font-extrabold text-white mb-3 drop-shadow-lg">{ob.name}</h3>
                                    <h3 className="text-4xl font-bold text-white/90 mb-8 drop-shadow-md">{ob.surname}</h3>
                                    
                                    {(ob.dob || ob.dod) && (
                                        <div className="flex items-center gap-4 text-2xl font-medium text-white/90 mb-10 bg-black/30 px-8 py-3 rounded-full border border-white/10 shadow-inner">
                                            <span>Nac: {formatDate(ob.dob)}</span>
                                            <span className="text-blue-400">|</span>
                                            <span>Fall: {formatDate(ob.dod)}</span>
                                        </div>
                                    )}

                                    <div className="mt-auto grid grid-cols-2 gap-4 w-full">
                                        {(ob.timeStart || ob.timeEnd) && (
                                            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
                                                <p className="text-blue-300 text-sm uppercase tracking-widest mb-1 font-semibold">Horario del Servicio</p>
                                                <p className="text-2xl font-bold text-white">
                                                    {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                </p>
                                            </div>
                                        )}
                                        {ob.cemetery && (
                                            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
                                                <p className="text-blue-300 text-sm uppercase tracking-widest mb-1 font-semibold">Destino Final</p>
                                                <p className="text-2xl font-bold text-white leading-tight break-words px-2" title={ob.cemetery}>{ob.cemetery}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center justify-center z-10">
                                    <p className="text-3xl font-light text-white/30 tracking-widest uppercase">Sala Disponible</p>
                                </div>
                            )}
                        </div>
                        ))}
                </div>
            ) : (
                <div className="w-full h-full">
                    <Slideshow media={media} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} onCompleteCycle={() => setShowObituaries(true)} transitionEffect={transitionEffect}></Slideshow>
                </div>
            )}
        </div>
    );
}