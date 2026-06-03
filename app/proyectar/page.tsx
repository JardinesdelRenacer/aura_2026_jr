"use client";

import { useState, useEffect } from "react";
import UploadMedia from "@/components/UploadMedia";
import Slideshow from "@/components/Slideshow";

// Tipos para los obituarios (se usarán en la Fase 2)
type Obituary = { name: string, surname: string, dob: string, dod: string, timeStart: string, timeEnd: string, cemetery: string, endTime?: string, endDate?: string };

export default function Proyectar() {

    const [files, setFiles] = useState<File[]>([]);

    const [autoPlay, setAutoplay] = useState(true);

    const [seconds, setSeconds] = useState(10);

    const [selectedImage, setSelectedImage] = useState(0);

    const [transitionEffect, setTransitionEffect] = useState("fade");

    const [mediaItems, setMediaItems] = useState<{url: string, type: string}[]>([]);

    const [showObituariesPreview, setShowObituariesPreview] = useState(true);

    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 10000); // Revisa cada 10 segundos
        return () => clearInterval(timer);
    }, []);

    const [obituaries, setObituaries] = useState({
        VIP: { name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "", endTime: "", endDate: "" },
        SALA_1: { name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "", endTime: "", endDate: "" },
        SALA_2: { name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "", endTime: "", endDate: "" },
        SALA_3: { name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "", endTime: "", endDate: "" },
    });

    const handleObituaryChange = (room: keyof typeof obituaries, field: keyof Obituary, value: string) => {
        setObituaries((prev) => ({
            ...prev,
            [room]: {
                ...prev[room],
                [field]: value,
            },
        }));
    };

    // Función para eliminar una imagen específica
    const removeImage = (indexToRemove: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
        // Ajusta la imagen seleccionada si eliminamos la que estaba en vista fija o una anterior
        if (selectedImage === indexToRemove) {
            setSelectedImage(0);
        } else if (selectedImage > indexToRemove) {
            setSelectedImage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        const items = files.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" : "image"
        }));
        setMediaItems(items);
        // Limpieza de memoria (muy importante para evitar memory leaks)
        return () => items.forEach((item) => URL.revokeObjectURL(item.url));
    }, [files]);

    // Lógica para alternar en la vista previa del Dashboard (30 segundos)
    useEffect(() => {
        if (!autoPlay || mediaItems.length === 0) {
            setShowObituariesPreview(true);
            return;
        }

        let timeoutId: NodeJS.Timeout;
        
        if (showObituariesPreview) {
            timeoutId = setTimeout(() => {
                setShowObituariesPreview(false);
            }, 30000);
        }

        return () => clearTimeout(timeoutId);
    }, [showObituariesPreview, autoPlay, mediaItems.length]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const parts = dateString.split("-");
        if(parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateString;
    };

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

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

    // Autoguardado en tiempo real de todos los cambios
    useEffect(() => {
        localStorage.setItem(
            "presentacion", JSON.stringify({media: mediaItems, autoPlay, seconds, selectedImage, obituaries, transitionEffect})
        );
    }, [mediaItems, autoPlay, seconds, selectedImage, obituaries, transitionEffect]);

    return (
        <div className="min-h-screen p-8 flex flex-col items-center">
            
            {/* Header del Dashboard - Estilo Glassmorphism */}
            <header className="w-full max-w-7xl flex justify-between items-center mb-8 p-4 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl border border-white/30">
                        JR {/* Aquí irá tu logo */}
                    </div>
                    <h1 className="text-2xl font-bold tracking-wider">Jardines del Renacer</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm opacity-80">admin@jardinesdelrenacer.co</span>
                    <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white/50 overflow-hidden">
                        {/* Avatar dinámico temporal */}
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
                    </div>
                </div>
            </header>

            {/* Contenedor Principal - Estilo Glassmorphism */}
            <div className="w-full max-w-7xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-8">
                
                <div className="w-full flex flex-col gap-8">
                    
                    {/* Sección 1: Configuración y Multimedia */}
                    <div className="w-full space-y-6 bg-black/10 p-6 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold border-b border-white/10 pb-4">1. Ajustes e Imágenes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <div className="p-4 bg-black/20 rounded-xl border border-white/10">
                                <label className="block font-bold mb-2">Modo visualización</label>
                                <select value={autoPlay ? "auto" : "fixed"} onChange={(e) => setAutoplay(e.target.value === "auto")} className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white outline-none focus:border-blue-400">
                                    <option value="fixed" className="text-black">Imagen fija</option>
                                    <option value="auto" className="text-black">Presentación automática</option>
                                </select>
                            </div>
                            <div className="p-4 bg-black/20 rounded-xl border border-white/10">
                                <label className="block font-bold mb-2">Tiempo por imagen (segundos)</label> 
                                <input type="number" min={1} value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white outline-none focus:border-blue-400" />
                            </div>
                            
                            <div className="p-4 bg-black/20 rounded-xl border border-white/10">
                                <label className="block font-bold mb-2">Efecto de Transición</label>
                                <select value={transitionEffect} onChange={(e) => setTransitionEffect(e.target.value)} className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white outline-none focus:border-blue-400">
                                    <option value="fade" className="text-black">Difuminado (Fade)</option>
                                    <option value="slide" className="text-black">Deslizamiento</option>
                                    <option value="zoom" className="text-black">Acercamiento (Zoom)</option>
                                    <option value="blur" className="text-black">Enfoque (Blur)</option>
                                    <option value="flip" className="text-black">Giro 3D</option>
                                    <option value="none" className="text-black">Ninguno (Corte brusco)</option>
                                </select>
                            </div>

                            {!autoPlay && (
                                <div className="p-4 bg-black/20 rounded-xl border border-white/10">
                                    <label className="block font-bold mb-2">Imagen a mostrar</label>
                                    <select value={selectedImage} onChange={(e) => setSelectedImage(Number(e.target.value))} className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white outline-none focus:border-blue-400">
                                        {files.map((file, index) => (
                                            <option key={index} value={index} className="text-black">{file.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    
                        <div className="mt-8 p-6 bg-black/20 rounded-2xl border border-white/10 shadow-inner">   
                            <h3 className="text-xl font-semibold mb-4 text-white/90">Carga de Archivos Multimedia</h3>
                            <UploadMedia files={files} setFiles={setFiles}/>
                            <p className="mt-4 text-white/70">Archivos listos para proyectar: <span className="font-bold text-white">{files.length}</span></p>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                {mediaItems.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="relative group cursor-move"
                                        draggable
                                        onDragStart={(e) => { e.dataTransfer.setData("draggedIndex", index.toString()); }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            const draggedIndex = Number(e.dataTransfer.getData("draggedIndex"));
                                            if (draggedIndex === index) return;
                                            setFiles(prev => {
                                                const newFiles = [...prev];
                                                const [draggedFile] = newFiles.splice(draggedIndex, 1);
                                                newFiles.splice(index, 0, draggedFile);
                                                return newFiles;
                                            });
                                        }}
                                    >
                                        {item.type === "video" ? (
                                            <video src={item.url} className="w-full h-32 object-cover rounded-lg border border-white/20 shadow-md group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <img src={item.url} alt={`media-${index}`} className="w-full h-32 object-cover rounded-lg border border-white/20 shadow-md group-hover:scale-105 transition-transform" /> 
                                        )}
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded shadow-lg border border-white/20">
                                            #{index + 1}
                                        </div>
                                        <button 
                                            onClick={() => removeImage(index)} 
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-red-700 z-10"
                                            title="Eliminar imagen"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                
                    {/* Sección 2: Obituarios */}
                    <div className="w-full space-y-6 bg-black/10 p-6 rounded-2xl border border-white/10 flex flex-col">
                        <div className="border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold">2. Gestión de Obituarios</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
                            {(Object.keys(obituaries) as Array<keyof typeof obituaries>).map((room) => (
                                <div key={room} className="p-6 bg-black/20 rounded-2xl border border-white/10 shadow-lg flex flex-col gap-4">
                                    <h3 className="text-xl font-bold text-blue-300 border-b border-white/20 pb-2">
                                        {room === "VIP" ? "Sala VIP" : room.replace("_", " ")}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-white/90">Nombre(s)</label>
                                            <input type="text" value={obituaries[room].name} onChange={(e) => handleObituaryChange(room, "name", e.target.value)} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all placeholder-white/30" placeholder="Ej: Juan" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-white/90">Apellido(s)</label>
                                            <input type="text" value={obituaries[room].surname} onChange={(e) => handleObituaryChange(room, "surname", e.target.value)} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all placeholder-white/30" placeholder="Ej: Pérez" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-white/90">Fecha de Nacimiento</label>
                                            <input type="date" value={obituaries[room].dob} onChange={(e) => handleObituaryChange(room, "dob", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all [color-scheme:dark] cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-white/90">Fecha de Fallecimiento</label>
                                            <input type="date" value={obituaries[room].dod} onChange={(e) => handleObituaryChange(room, "dod", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all [color-scheme:dark] cursor-pointer" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-white/90">Hora Inicio</label>
                                                    <input type="time" value={obituaries[room].timeStart || ""} onChange={(e) => handleObituaryChange(room, "timeStart", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all [color-scheme:dark] cursor-pointer" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-white/90">Hora Fin</label>
                                                    <input type="time" value={obituaries[room].timeEnd || ""} onChange={(e) => handleObituaryChange(room, "timeEnd", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all [color-scheme:dark] cursor-pointer" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-white/90">Destino Final</label>
                                                    <input type="text" value={obituaries[room].cemetery} onChange={(e) => handleObituaryChange(room, "cemetery", e.target.value)} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all placeholder-white/30" placeholder="Ej: Jardines..." />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-blue-900/20 p-3 rounded-xl border border-blue-400/20">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-blue-300">Fecha de ocultamiento:</label>
                                                    <input type="date" value={obituaries[room].endDate || ""} onChange={(e) => handleObituaryChange(room, "endDate", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all [color-scheme:dark] cursor-pointer" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-blue-300">Ocultar a las:</label>
                                                    <input type="time" value={obituaries[room].endTime || ""} onChange={(e) => handleObituaryChange(room, "endTime", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/10 border border-white/20 p-2.5 rounded-lg text-white outline-none focus:border-blue-400 focus:bg-white/20 transition-all [color-scheme:dark] cursor-pointer" />
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-3">
                                                <button type="button" onClick={() => { handleObituaryChange(room, "timeStart", ""); handleObituaryChange(room, "timeEnd", ""); handleObituaryChange(room, "endTime", ""); handleObituaryChange(room, "endDate", ""); }} className="text-xs font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1 rounded-full transition-colors border border-red-400/20">
                                                    Limpiar Horarios
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                
                {/* Sección 3: Vista Previa */}
                <div className="mt-8 space-y-6 bg-black/10 p-6 rounded-2xl border border-white/10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-white/10 pb-4 gap-2">
                        <h2 className="text-2xl font-bold">3. Vista Previa en Vivo</h2>
                        <p className="text-sm text-white/70 bg-black/30 px-3 py-1 rounded-full">Simulación a escala (Ciclo 30s)</p>
                    </div>
                            
                        {/* Contenedor que simula la pantalla de proyección a escala */}
                        <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden relative border-4 border-white/20 shadow-2xl scale-100 transform origin-top">
                            {showObituariesPreview ? (
                                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
                                    {Object.entries(obituaries)
                                        .map(([roomKey, ob]) => {
                                            const expired = checkIsExpired(ob.endTime, ob.endDate);
                                            const isActive = Boolean((ob.name || ob.surname) && !expired);
                                            return { roomKey, ob, isActive };
                                        })
                                        .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                                        .map(({ roomKey, ob, isActive }) => (
                                        <div key={roomKey} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col justify-start items-center text-center shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-bl-full blur-2xl"></div>
                                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-tr-full blur-2xl"></div>

                                            <h2 className="text-xl font-bold text-blue-300 mb-4 tracking-[0.2em] uppercase border-b border-white/20 pb-2 w-3/4">
                                                {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                                            </h2>
                                            
                                            {isActive ? (
                                                <div className="flex flex-col flex-grow w-full justify-center items-center z-10">
                                                    <h3 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">{ob.name}</h3>
                                                    <h3 className="text-2xl font-bold text-white/90 mb-4 drop-shadow-md">{ob.surname}</h3>
                                                    
                                                    {(ob.dob || ob.dod) && (
                                                        <div className="flex items-center gap-2 text-sm font-medium text-white/90 mb-6 bg-black/30 px-4 py-2 rounded-full border border-white/10 shadow-inner">
                                                            <span>Nac: {formatDate(ob.dob)}</span>
                                                            <span className="text-blue-400">|</span>
                                                            <span>Fall: {formatDate(ob.dod)}</span>
                                                        </div>
                                                    )}

                                                    <div className="mt-auto grid grid-cols-2 gap-2 w-full">
                                                        {(ob.timeStart || ob.timeEnd) && (
                                                            <div className="bg-white/10 border border-white/20 rounded-xl p-2 backdrop-blur-sm shadow-lg">
                                                                <p className="text-blue-300 text-[0.6rem] uppercase tracking-widest mb-1 font-semibold">Horario del Servicio</p>
                                                                <p className="text-sm font-bold text-white">
                                                                    {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {ob.cemetery && (
                                                            <div className="bg-white/10 border border-white/20 rounded-xl p-2 backdrop-blur-sm shadow-lg">
                                                                <p className="text-blue-300 text-[0.6rem] uppercase tracking-widest mb-1 font-semibold">Destino Final</p>
                                                                <p className="text-sm font-bold text-white leading-tight break-words px-1" title={ob.cemetery}>{ob.cemetery}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-grow flex items-center justify-center z-10">
                                                    <p className="text-xl font-light text-white/30 tracking-widest uppercase">Sala Disponible</p>
                                                </div>
                                            )}
                                        </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="w-full h-full">
                                    <Slideshow media={mediaItems} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} onCompleteCycle={() => setShowObituariesPreview(true)} transitionEffect={transitionEffect}></Slideshow>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/20 flex justify-end">
                    <button 
                        onClick={() => {
                            window.open("/Pantalla","_blank");
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 transition-all"
                    >
                        Abrir Pantalla de Proyección
                    </button>
                </div>
            </div>
        </div>
    );
}
