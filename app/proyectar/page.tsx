"use client";
/* eslint-disable @next/next/no-img-element */
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import UploadMedia from "@/components/UploadMedia";
import Slideshow from "@/components/Slideshow";



// Tipos para los obituarios (se usarán en la Fase 2)
type Obituary = { name: string, surname: string, dob: string, dod: string, timeStart: string, timeEnd: string, cemetery: string, endTime?: string, endDate?: string, massTime?: string, massChurch?: string, massChurchType?: string, massAddress?: string };

export default function Proyectar() {
    
    const params = useParams();

    const sedeId = params.id as string;

    console.log("Sede:", sedeId)
    
    const [ loading, setLoading ] = useState(true);

    const [files, setFiles] = useState<File[]>([]);

    const [autoPlay, setAutoplay] = useState(true);

    const [seconds, setSeconds] = useState(10);

    const [selectedImage, setSelectedImage] = useState(0);

    const [transitionEffect, setTransitionEffect] = useState("fade");

    const [projectionMode, setProjectionMode] = useState("classic");

    const [showObituariesPreview, setShowObituariesPreview] = useState(true);

    const [currentTime, setCurrentTime] = useState(() => new Date());

    const router = useRouter();

    const handleLogout = () => {
        router.push("/login");
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 10000); // Revisa cada 10 segundos
        return () => clearInterval(timer);
    }, []);

    const [obituaries, setObituaries] = useState({
        VIP: { name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "", endTime: "", endDate: "", massTime: "", massChurch: "", massChurchType: "Parroquia", massAddress: "" },
        SALA_1: { name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "", endTime: "", endDate: "", massTime: "", massChurch: "", massChurchType: "Parroquia", massAddress: "" },
        SALA_2: { name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "", endTime: "", endDate: "", massTime: "", massChurch: "", massChurchType: "Parroquia", massAddress: "" },
        SALA_3: { name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "", endTime: "", endDate: "", massTime: "", massChurch: "", massChurchType: "Parroquia", massAddress: "" },
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

    const mediaItems = useMemo(() => {
        return files.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" : "image"
        }));
    }, [files]);

    useEffect(() => {
        // Limpieza de memoria (muy importante para evitar memory leaks)
        return () => mediaItems.forEach((item) => URL.revokeObjectURL(item.url));
    }, [mediaItems]);

    const shouldForceObituariesPreview = !autoPlay || mediaItems.length === 0;
    const isShowingObituariesPreview = shouldForceObituariesPreview || showObituariesPreview;

    // Lógica para alternar en la vista previa del Dashboard (30 segundos)
    useEffect(() => {
        if (shouldForceObituariesPreview || !isShowingObituariesPreview) return;

        const timeoutId = setTimeout(() => {
            setShowObituariesPreview(false);
        }, 30000);

        return () => clearTimeout(timeoutId);
    }, [isShowingObituariesPreview, shouldForceObituariesPreview]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const parts = dateString.split("-");
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
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

    const handleCompleteCycle = useCallback(() => {
        setShowObituariesPreview(true);
    }, []);

    // Toma los datos del usuario MASTER desde sessionStorage para mostrar su email en el header
    interface User{
        email: string;
    }
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Autoguardado en tiempo real de todos los cambios
    useEffect(() => {
        localStorage.setItem(
            "presentacion", JSON.stringify({ media: mediaItems, autoPlay, seconds, selectedImage, obituaries, transitionEffect, projectionMode })
        );
    }, [mediaItems, autoPlay, seconds, selectedImage, obituaries, transitionEffect, projectionMode]);

    interface Sede {
        id: number,
        nombre: string;
    }

    const [sede, setSede] = useState<Sede | null>(null);

    useEffect(() => {
        if (!sedeId) return;

        const cargarSede = async () => {
            try{
                const resp = await fetch(`/api/master/sedes/${sedeId}`);
                const data = await resp.json();

                setSede(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        cargarSede();
    }, [sedeId]);

    if (loading) {
        return <div>Cargando sede...</div>
    }

    return (
        

        <div className="min-h-screen p-8 flex flex-col items-center">
   
            {/* Header del Dashboard - Estilo Glassmorphism */}
            <header className="w-full max-w-7xl flex justify-between items-center mb-8 p-4 bg-white/40 backdrop-blur-lg border border-white/60 shadow-xl rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-950 rounded-full flex items-center justify-center border border-white/60 shadow-sm p-1.5">
                        <img src="/imagenes/logo-oficial.webp" alt="JR Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-wider text-slate-800">Aura 2026 - Jardines del Renacer</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 font-medium">{user?.email}</span>
                    <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                        {/* Avatar dinámico temporal */}
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
                    </div>
                    <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-200 hover:border-red-300 font-bold px-4 py-2 rounded-full transition-all text-xs uppercase tracking-widest">
                        Salir
                    </button>
                </div>
            </header>

            {/* Contenedor Principal - Estilo Glassmorphism */}
            <div className="w-full max-w-7xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8">

                <div className="w-full flex flex-col gap-8">

                    {/* Sección 1: Configuración y Multimedia */}
                    <div className="w-full space-y-6 bg-white/50 p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg">
                        <h2 className="text-2xl font-black border-b-2 border-slate-200/60 pb-4 text-slate-800 text-center tracking-wide">1. Ajustes de Proyección</h2>
                        <div className="flex flex-wrap justify-center items-stretch gap-5 mt-8">
                            
                            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                                <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Diseño Pantalla</label>
                                <select value={projectionMode} onChange={(e) => setProjectionMode(e.target.value)} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                                    <option value="classic" className="text-black font-medium">Clásico (Alternado)</option>
                                    <option value="split" className="text-black font-medium">Dividida (L + Publ.)</option>
                                </select>
                            </div>

                            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                                <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Visualización</label>
                                <select value={autoPlay ? "auto" : "fixed"} onChange={(e) => setAutoplay(e.target.value === "auto")} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                                    <option value="fixed" className="text-black font-medium">Imagen Fija</option>
                                    <option value="auto" className="text-black font-medium">Automática</option>
                                </select>
                            </div>

                            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                                <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Tiempo (Segundos)</label>
                                <input type="number" min={1} max={30} value={seconds} onChange={(e) => setSeconds(Math.min(30, Math.max(1, Number(e.target.value))))} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-blue-600 font-black outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-lg shadow-inner" />
                            </div>

                            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                                <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Transición</label>
                                <select value={transitionEffect} onChange={(e) => setTransitionEffect(e.target.value)} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                                    <option value="fade" className="text-black font-medium">Difuminado</option>
                                    <option value="slide" className="text-black font-medium">Deslizamiento</option>
                                    <option value="zoom" className="text-black font-medium">Acercamiento</option>
                                    <option value="blur" className="text-black font-medium">Enfoque (Blur)</option>
                                    <option value="flip" className="text-black font-medium">Giro 3D</option>
                                    <option value="none" className="text-black font-medium">Ninguno</option>
                                </select>
                            </div>

                            {!autoPlay && (
                                <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                                    <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Mostrar Imagen</label>
                                    <select value={selectedImage} onChange={(e) => setSelectedImage(Number(e.target.value))} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                                        {files.map((file, index) => (
                                            <option key={index} value={index} className="text-black font-medium">{file.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 p-6 bg-white/50 rounded-2xl border border-white/60 shadow-inner">
                            <h3 className="text-xl font-bold mb-4 text-slate-800">Carga de Archivos Multimedia</h3>
                            <UploadMedia setFiles={setFiles} />
                            <p className="mt-4 text-slate-600">Archivos listos para proyectar: <span className="font-bold text-blue-600">{files.length}</span></p>
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
                                        <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm text-blue-800 text-xs font-bold px-2 py-1 rounded shadow-md border border-white">
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
                    <div className="w-full space-y-6 bg-white/50 p-6 rounded-2xl border border-white/60 flex flex-col shadow-sm">
                        <div className="border-b border-slate-200 pb-4">
                            <h2 className="text-2xl font-bold text-slate-800">2. Gestión de Obituarios</h2>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
                            {(Object.keys(obituaries) as Array<keyof typeof obituaries>).map((room) => (
                                <div key={room} className="p-6 bg-white/60 rounded-2xl border border-white/60 shadow-md flex flex-col gap-4">
                                    <h3 className="text-xl font-bold text-blue-700 border-b border-slate-200 pb-2">
                                        {room === "VIP" ? "Sala VIP" : room.replace("_", " ")}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-slate-700">Nombre(s)</label>
                                            <input type="text" value={obituaries[room].name} onChange={(e) => handleObituaryChange(room, "name", e.target.value)} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 shadow-inner" placeholder="Ej: Juan" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-slate-700">Apellido(s)</label>
                                            <input type="text" value={obituaries[room].surname} onChange={(e) => handleObituaryChange(room, "surname", e.target.value)} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 shadow-inner" placeholder="Ej: Pérez" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-slate-700">Fecha de Nacimiento</label>
                                            <input type="date" value={obituaries[room].dob} onChange={(e) => handleObituaryChange(room, "dob", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer shadow-inner" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-slate-700">Fecha de Fallecimiento</label>
                                            <input type="date" value={obituaries[room].dod} onChange={(e) => handleObituaryChange(room, "dod", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer shadow-inner" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-slate-700">Hora Inicio</label>
                                                    <input type="time" value={obituaries[room].timeStart || ""} onChange={(e) => handleObituaryChange(room, "timeStart", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer shadow-inner" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-slate-700">Hora Fin</label>
                                                    <input type="time" value={obituaries[room].timeEnd || ""} onChange={(e) => handleObituaryChange(room, "timeEnd", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer shadow-inner" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-slate-700">Destino Final</label>
                                                    <input type="text" value={obituaries[room].cemetery} onChange={(e) => handleObituaryChange(room, "cemetery", e.target.value)} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 shadow-inner" placeholder="Ej: Jardines..." />
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-200 mt-4 pt-4">
                                                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">⛪ Eucaristía</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold mb-1 text-slate-700">Hora</label>
                                                        <input type="time" value={obituaries[room].massTime || ""} onChange={(e) => handleObituaryChange(room, "massTime", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer shadow-inner" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold mb-1 text-slate-700">Lugar</label>
                                                        <div className="flex gap-1">
                                                            <select value={obituaries[room].massChurchType || "Parroquia"} onChange={(e) => handleObituaryChange(room, "massChurchType", e.target.value)} className="w-[45%] bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner text-xs px-1">
                                                                <option value="Parroquia">Parroquia</option>
                                                                <option value="Iglesia">Iglesia</option>
                                                                <option value="Capilla">Capilla</option>
                                                                <option value="Catedral">Catedral</option>
                                                            </select>
                                                            <input type="text" value={obituaries[room].massChurch || ""} onChange={(e) => handleObituaryChange(room, "massChurch", e.target.value)} className="w-[55%] bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 shadow-inner" placeholder="Ej: San Miguel" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold mb-1 text-slate-700">Dirección</label>
                                                        <input type="text" value={obituaries[room].massAddress || ""} onChange={(e) => handleObituaryChange(room, "massAddress", e.target.value)} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 shadow-inner" placeholder="Ej: Calle 10 # 5-20" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-blue-50/60 p-3 rounded-xl border border-blue-200 shadow-sm">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-blue-800">Fecha de ocultamiento:</label>
                                                        <input type="date" value={obituaries[room].endDate || ""} onChange={(e) => handleObituaryChange(room, "endDate", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/70 border border-blue-200 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer shadow-inner" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1 text-blue-800">Ocultar a las:</label>
                                                        <input type="time" value={obituaries[room].endTime || ""} onChange={(e) => handleObituaryChange(room, "endTime", e.target.value)} onKeyDown={(e) => { if (!["Tab", "Backspace", "Delete"].includes(e.key)) e.preventDefault(); }} className="w-full bg-white/70 border border-blue-200 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer shadow-inner" />
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-3">
                                                <button type="button" onClick={() => { handleObituaryChange(room, "timeStart", ""); handleObituaryChange(room, "timeEnd", ""); handleObituaryChange(room, "endTime", ""); handleObituaryChange(room, "endDate", ""); handleObituaryChange(room, "massTime", ""); handleObituaryChange(room, "massChurch", ""); handleObituaryChange(room, "massChurchType", "Parroquia"); handleObituaryChange(room, "massAddress", ""); }} className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors border border-red-200">
                                                    Limpiar Horarios / Datos
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sección 3: Vista Previa */}
                    <div className="mt-8 space-y-6 bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-slate-200 pb-4 gap-2">
                            <h2 className="text-2xl font-bold text-slate-800">3. Vista Previa en Vivo</h2>
                            <p className="text-sm text-blue-800 bg-blue-100/80 px-3 py-1 rounded-full shadow-inner border border-blue-200">Simulación a escala (Ciclo 30s)</p>
                        </div>

                        {/* Contenedor que simula la pantalla de proyección a escala */}
                        <div className="w-full aspect-video bg-white/80 rounded-3xl overflow-hidden relative border-4 border-white shadow-2xl scale-100 transform origin-top">
                            {projectionMode === "split" ? (
                                <div className="w-full h-full p-2 sm:p-4 bg-linear-to-br from-white/60 via-blue-50/50 to-white/40 backdrop-blur-2xl">
                                    <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2 sm:gap-4">
                                        {/* Media Slider en Top Right */}
                                        <div className="col-start-2 col-span-2 row-start-1 min-h-0 min-w-0 h-full w-full rounded-xl sm:rounded-2xl overflow-hidden relative shadow-xl border border-white/80 bg-white/40">
                                            <div className="absolute inset-0">
                                                <Slideshow media={mediaItems} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} transitionEffect={transitionEffect} />
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
                                                    <div key={roomKey} className={`${slotClasses[index]} min-h-0 min-w-0 h-full w-full bg-[url('/imagenes/fondo_obituarios.png')] bg-size-[100%_100%] bg-no-repeat border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-4 flex flex-col justify-start items-center text-center shadow-lg relative overflow-hidden`}>
                                                        <div className="absolute inset-0 p-2 sm:p-4 flex flex-col justify-start items-center text-center">
                                                            <h2 className="text-[0.6rem] sm:text-xs font-bold text-black mb-2 tracking-widest uppercase border-b border-black/20 pb-1 w-3/4 [text-shadow:0_1px_2px_rgb(255_255_255)]">
                                                                {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                                                            </h2>

                                                            {isActive ? (
                                                                <div className="flex flex-col grow w-full justify-center items-center z-10 overflow-hidden">
                                                                    <h3 className="text-xs sm:text-sm font-extrabold text-black mb-1 truncate w-full px-1 [text-shadow:0_1px_2px_rgb(255_255_255)]">{ob.name}</h3>
                                                                    <h3 className="text-[0.65rem] sm:text-xs font-bold text-black/90 mb-1 sm:mb-2 truncate w-full px-1 [text-shadow:0_1px_2px_rgb(255_255_255)]">{ob.surname}</h3>

                                                                    {(ob.dob || ob.dod) && (
                                                                        <div className="flex items-center gap-1 sm:gap-2 text-[0.45rem] sm:text-[0.55rem] font-medium text-black mb-1 sm:mb-2 bg-white/40 px-2 py-1 rounded-full border border-black/10 shadow-sm backdrop-blur-sm whitespace-nowrap overflow-hidden">
                                                                            <span className="truncate">Nacimiento: {formatDate(ob.dob)}</span>
                                                                            <span className="text-black/50">|</span>
                                                                            <span className="truncate">Fallecimiento: {formatDate(ob.dod)}</span>
                                                                        </div>
                                                                    )}

                                                                    {(ob.massTime || ob.massChurch) && (
                                                                        <div className="flex flex-col items-center justify-center gap-0.5 bg-white/40 px-2 py-1 rounded-lg border border-black/10 shadow-sm backdrop-blur-sm mb-1 sm:mb-2 w-[95%] overflow-hidden">
                                                                            <span className="text-[0.35rem] font-bold uppercase tracking-widest text-black/80">Eucaristía</span>
                                                                            <span className="text-[0.45rem] font-bold text-black truncate w-full px-1">
                                                                                {ob.massChurch ? `${ob.massChurchType || "Parroquia"}: ${ob.massChurch}` : (ob.massChurchType || "Parroquia")} {ob.massTime && `- ${formatTime(ob.massTime)}`}
                                                                            </span>
                                                                            {ob.massAddress && <span className="text-[0.4rem] font-medium text-black/80 truncate w-full px-1">{ob.massAddress}</span>}
                                                                        </div>
                                                                    )}

                                                                    <div className="mt-auto grid grid-cols-2 gap-1 w-full">
                                                                        {(ob.timeStart || ob.timeEnd) && (
                                                                            <div className="bg-white/30 border border-black/10 rounded-lg p-1 sm:p-2 backdrop-blur-md shadow-sm flex flex-col justify-center overflow-hidden">
                                                                                <p className="text-black/80 text-[0.4rem] uppercase tracking-widest mb-0.5 font-bold [text-shadow:0_1px_2px_rgb(255_255_255)] truncate">Horario</p>
                                                                                <p className="text-[0.5rem] sm:text-xs font-bold text-black [text-shadow:0_1px_2px_rgb(255_255_255)] truncate">
                                                                                    {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                        {ob.cemetery && (
                                                                            <div className="bg-white/30 border border-black/10 rounded-lg p-1 sm:p-2 backdrop-blur-md shadow-sm flex flex-col justify-center overflow-hidden">
                                                                                <p className="text-black/80 text-[0.4rem] uppercase tracking-widest mb-0.5 font-bold [text-shadow:0_1px_2px_rgb(255_255_255)] truncate">Destino</p>
                                                                                <p className="text-[0.5rem] sm:text-xs font-bold text-black leading-tight truncate w-full px-1 [text-shadow:0_1px_2px_rgb(255_255_255)]" title={ob.cemetery}>{ob.cemetery}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="grow flex items-center justify-center z-10">
                                                                    <p className="text-xs font-bold text-black/40 tracking-widest uppercase [text-shadow:0_1px_2px_rgb(255_255_255)] truncate">Disponible</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ) : isShowingObituariesPreview ? (
                                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 p-4 bg-linear-to-br from-white/60 via-blue-50/50 to-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.1)]">
                                    {Object.entries(obituaries)
                                        .map(([roomKey, ob]) => {
                                            const expired = checkIsExpired(ob.endTime, ob.endDate);
                                            const isActive = Boolean((ob.name || ob.surname) && !expired);
                                            return { roomKey, ob, isActive };
                                        })
                                        .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                                        .map(({ roomKey, ob, isActive }) => (
                                            <div key={roomKey} className="bg-[url('/imagenes/fondo_obituarios.png')] bg-size-[100%_100%] bg-no-repeat border border-white/20 rounded-2xl p-6 flex flex-col justify-start items-center text-center shadow-xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-bl-full blur-2xl"></div>
                                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/30 rounded-tr-full blur-2xl"></div>

                                                <h2 className="text-xl font-bold text-black mb-4 tracking-[0.2em] uppercase border-b border-black/20 pb-2 w-3/4 [text-shadow:0_1px_3px_rgb(255_255_255)]">
                                                    {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                                                </h2>

                                                {isActive ? (
                                                    <div className="flex flex-col grow w-full justify-center items-center z-10">
                                                        <h3 className="text-xl sm:text-2xl font-extrabold text-black mb-1 truncate w-full px-2 [text-shadow:0_1px_3px_rgb(255_255_255)]">{ob.name}</h3>
                                                        <h3 className="text-lg sm:text-xl font-bold text-black/90 mb-3 truncate w-full px-2 [text-shadow:0_1px_3px_rgb(255_255_255)]">{ob.surname}</h3>

                                                        {(ob.dob || ob.dod) && (
                                                            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-black mb-4 bg-white/40 px-4 py-1.5 rounded-full border border-black/10 shadow-lg backdrop-blur-sm overflow-hidden whitespace-nowrap">
                                                                <span>Nacimiento: {formatDate(ob.dob)}</span>
                                                                <span className="text-black/50">|</span>
                                                                <span>Fallecimiento: {formatDate(ob.dod)}</span>
                                                            </div>
                                                        )}

                                                        {(ob.massTime || ob.massChurch) && (
                                                            <div className="flex flex-col items-center justify-center gap-1 bg-white/40 px-4 py-2 rounded-xl border border-black/10 shadow-lg backdrop-blur-sm mb-4 w-[95%] overflow-hidden">
                                                                <span className="text-[0.5rem] font-bold uppercase tracking-widest text-black/80">Eucaristía</span>
                                                                <span className="text-xs font-bold text-black truncate w-full px-2">
                                                                    {ob.massChurch ? `${ob.massChurchType || "Parroquia"}: ${ob.massChurch}` : (ob.massChurchType || "Parroquia")} {ob.massTime && `- ${formatTime(ob.massTime)}`}
                                                                </span>
                                                                {ob.massAddress && <span className="text-[0.65rem] font-medium text-black/80 truncate w-full px-2">{ob.massAddress}</span>}
                                                            </div>
                                                        )}

                                                        <div className="mt-auto grid grid-cols-2 gap-2 w-full">
                                                            {(ob.timeStart || ob.timeEnd) && (
                                                                <div className="bg-white/30 border border-black/10 rounded-xl p-2 backdrop-blur-md shadow-lg flex flex-col justify-center overflow-hidden">
                                                                    <p className="text-black/80 text-[0.5rem] sm:text-[0.6rem] uppercase tracking-widest mb-0.5 font-bold [text-shadow:0_1px_2px_rgb(255_255_255)] truncate">Horario</p>
                                                                    <p className="text-xs sm:text-sm font-bold text-black [text-shadow:0_1px_3px_rgb(255_255_255)] truncate">
                                                                        {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {ob.cemetery && (
                                                                <div className="bg-white/30 border border-black/10 rounded-xl p-2 backdrop-blur-md shadow-lg flex flex-col justify-center overflow-hidden">
                                                                    <p className="text-black/80 text-[0.5rem] sm:text-[0.6rem] uppercase tracking-widest mb-0.5 font-bold [text-shadow:0_1px_2px_rgb(255_255_255)] truncate">Destino</p>
                                                                    <p className="text-xs sm:text-sm font-bold text-black leading-tight truncate w-full px-1 [text-shadow:0_1px_3px_rgb(255_255_255)]" title={ob.cemetery}>{ob.cemetery}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grow flex items-center justify-center z-10">
                                                        <p className="text-xl font-bold text-black/40 tracking-widest uppercase [text-shadow:0_1px_3px_rgb(255_255_255)]">Sala Disponible</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="w-full h-full">
                                    <Slideshow media={mediaItems} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} onCompleteCycle={handleCompleteCycle} transitionEffect={transitionEffect}></Slideshow>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-300 flex justify-end">
                    <button
                        onClick={() => {
                            window.open("/Pantalla", "_blank");
                        }}
                        className="bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 transition-all"
                    >
                        Abrir Pantalla de Proyección
                    </button>
                </div>
            </div>
        </div>
    );
}
