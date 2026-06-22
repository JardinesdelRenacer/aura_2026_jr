"use client";
/* eslint-disable @next/next/no-img-element */
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import VistaPreviaTab from "@/app/proyectar/components/VistaPreviaTab";
import AdministrarTab from "./components/AdministrarTab";
import { isVerticalProjectionSede } from "./projection-config";

// Tipos para los obituarios (se usarán en la Fase 2)
export type Obituary = { name: string, surname: string, dob: string, dod: string, timeStart: string, timeEnd: string, cemetery: string, endTime?: string, endDate?: string, massTime?: string, massChurch?: string, massChurchType?: string, massAddress?: string };

export type RoomKeys = "VIP" | "SALA_1" | "SALA_2" | "SALA_3";
type MediaItem = { url: string; type: string };

interface StoredPresentation {
    media?: MediaItem[];
    autoPlay?: boolean;
    seconds?: number;
    selectedImage?: number;
    obituaries?: Record<RoomKeys, Obituary>;
    transitionEffect?: string;
}

export default function Proyectar() {
    const params = useParams();

    const slug = Array.isArray(params.slug) ? params.slug : [];
    const sedeId = typeof params.id === "string" ? params.id : slug[0];
    const sala = typeof params.room === "string" ? params.room : slug[1];

    const [loading, setLoading] = useState(Boolean(sedeId));

    const [files, setFiles] = useState<File[]>([]);
    const [projectionMediaItems, setProjectionMediaItems] = useState<MediaItem[]>([]);

    const [autoPlay, setAutoplay] = useState(true);

    const [seconds, setSeconds] = useState(10);

    const [selectedImage, setSelectedImage] = useState(0);

    const [transitionEffect, setTransitionEffect] = useState("fade");

    const [projectionMode, setProjectionMode] = useState("classic");

    const [showObituariesPreview, setShowObituariesPreview] = useState(true);

    const [currentTime, setCurrentTime] = useState(() => new Date());

    const router = useRouter();

    const [sede, setSede] = useState<Sede | null>(null);
    const usesVerticalProjection = isVerticalProjectionSede(sede?.nombre);

    const [activeTab, setActiveTab] = useState<'administrar' | 'configuracion' | 'vista-previa'>(sala ? 'vista-previa' : 'administrar');

    const [presentacionId] = useState(() => Math.floor(100000000 + Math.random() * 900000000 ).toString());
    
    const handleLogout = () => {
        router.push("/login");
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 10000); // Revisa cada 10 segundos
        return () => clearInterval(timer);
    }, []);

    const [obituaries, setObituaries] = useState<Record<RoomKeys, Obituary>>({
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

    const dashboardMediaItems = useMemo(() => {
        return files.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" : "image"
        }));
    }, [files]);

    const mediaItems = sala ? projectionMediaItems : dashboardMediaItems;

    useEffect(() => {
        // Limpieza de memoria (muy importante para evitar memory leaks)
        return () => dashboardMediaItems.forEach((item) => URL.revokeObjectURL(item.url));
    }, [dashboardMediaItems]);

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

    const roomsToShow = useMemo(() => {
        const rooms: RoomKeys[] = [];

        for (let i = 1; i <= (sede?.numeroSalas ?? 0); i++) {
            rooms.push(`SALA_${i}` as RoomKeys);
        }

        if (sede?.salaVip) {
            rooms.push("VIP");
        }

        return rooms;
    }, [sede?.numeroSalas, sede?.salaVip]);

    // Toma los datos del usuario MASTER desde sessionStorage para mostrar su email en el header
    interface User{
        email: string;
    }
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const userData = sessionStorage.getItem("user");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    const syncPresentation = useCallback(() => {
        if (!sedeId) return;

        const presentation = JSON.stringify({
            media: dashboardMediaItems,
            autoPlay,
            seconds,
            selectedImage,
            obituaries,
            transitionEffect,
            projectionMode,
            roomsToShow,
            sedeId,
        });

        localStorage.setItem(`presentacion-${presentacionId}`, presentation);
        localStorage.setItem(`proyeccion-sede-${sedeId}`, presentation);
    }, [autoPlay, dashboardMediaItems, seconds, selectedImage, obituaries, transitionEffect, projectionMode, roomsToShow, presentacionId, sedeId]);

    // Autoguardado en tiempo real de todos los cambios
    useEffect(() => {
        if (sala || loading || !sedeId) return;

        syncPresentation();
    }, [loading, sala, sedeId, syncPresentation]);

    const openVerticalProjection = useCallback((roomKey: RoomKeys) => {
        syncPresentation();
        window.open(`/proyectar/${sedeId}/${roomKey}`, "_blank");
    }, [sedeId, syncPresentation]);

    interface Sede {
        id: string, //el campo estaba en number, si algo.. se cambia nuevamente
        nombre: string;
        numeroSalas: number;
        salaVip: boolean;
    }
  
    const cargarSede = useCallback(async () => {
        try{
            const resp = await fetch(`/api/master/sedes/${sedeId}`);
            const data = await resp.json();

            if (!data.ok) return;
            
            const sedeData = data.sede;

            setSede(sedeData);

            //Configuración
            if (sedeData.configuracion) {
                setAutoplay(sedeData.configuracion.autoplay);
                setSeconds(sedeData.configuracion.seconds);
                setTransitionEffect(
                    sedeData.configuracion.transitionEffect
                );
            }

            //Obituarios
            if (sedeData.obituarios?.length) {
                const nuevosObituarios = {
                    VIP: {
                        name: "",
                        surname: "",
                        dob: "",
                        dod: "",
                        timeStart: "",
                        timeEnd: "",
                        cemetery: "",
                        endTime: "",
                        endDate: "",
                        massTime: "",
                        massChurch: "",
                        massChurchType: "Parroquia",
                        massAddress: "",
                    },
                    SALA_1: {
                        name: "",
                        surname: "",
                        dob: "",
                        dod: "",
                        timeStart: "",
                        timeEnd: "",
                        cemetery: "",
                        endTime: "",
                        endDate: "",
                        massTime: "",
                        massChurch: "",
                        massChurchType: "Parroquia",
                        massAddress: "",
                    },
                    SALA_2: {
                        name: "",
                        surname: "",
                        dob: "",
                        dod: "",
                        timeStart: "",
                        timeEnd: "",
                        cemetery: "",
                        endTime: "",
                        endDate: "",
                        massTime: "",
                        massChurch: "",
                        massChurchType: "Parroquia",
                        massAddress: "",
                    },
                    SALA_3: {
                        name: "",
                        surname: "",
                        dob: "",
                        dod: "",
                        timeStart: "",
                        timeEnd: "",
                        cemetery: "",
                        endTime: "",
                        endDate: "",
                        massTime: "",
                        massChurch: "",
                        massChurchType: "Parroquia",
                        massAddress: "",
                    },
                };

                sedeData.obituarios.forEach((ob: Obituary & { sala: RoomKeys }) => {
                    nuevosObituarios[ob.sala as keyof typeof nuevosObituarios] = {
                        name: ob.name ?? "",
                        surname: ob.surname ?? "",
                        dob: ob.dob ?? "",
                        dod: ob.dod ?? "", 
                        timeStart: ob.timeStart ?? "",
                        timeEnd: ob.timeEnd ?? "",
                        cemetery: ob.cemetery ?? "",
                        endTime: ob.endTime ?? "",
                        endDate: ob.endDate ?? "",
                        massTime: ob.massTime ?? "",
                        massChurch: ob.massChurch ?? "",
                        massChurchType:
                            ob.massChurchType ?? "Parroquia",
                        massAddress: ob.massAddress ?? "",
                    };
                });

                setObituaries(nuevosObituarios);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [sedeId]);

    useEffect(() => {
        if (!sedeId) return;

        const timeoutId = window.setTimeout(() => {
            void cargarSede();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [cargarSede, sedeId]);

    useEffect(() => {
        if (!sala || !sedeId || loading) return;

        const storageKey = `proyeccion-sede-${sedeId}`;
        const loadPresentation = (raw: string | null) => {
            if (!raw) return;

            try {
                const presentation = JSON.parse(raw) as StoredPresentation;

                if (Array.isArray(presentation.media)) {
                    setProjectionMediaItems(presentation.media);
                }
                if (presentation.obituaries) {
                    setObituaries(presentation.obituaries);
                }
                if (typeof presentation.autoPlay === "boolean") {
                    setAutoplay(presentation.autoPlay);
                }
                if (typeof presentation.seconds === "number") {
                    setSeconds(presentation.seconds);
                }
                if (typeof presentation.selectedImage === "number") {
                    setSelectedImage(presentation.selectedImage);
                }
                if (presentation.transitionEffect) {
                    setTransitionEffect(presentation.transitionEffect);
                }
            } catch (error) {
                console.error("No se pudo cargar la presentación vertical:", error);
            }
        };

        const timeoutId = window.setTimeout(() => {
            loadPresentation(localStorage.getItem(storageKey));
        }, 0);
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === storageKey) {
                loadPresentation(event.newValue);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [loading, sala, sedeId]);

    if (loading) {
        return <div>Cargando sede...</div>
    }

    if (!sedeId) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50">
                <h2 className="text-2xl font-bold text-red-600">⚠️ No se especificó ninguna Sede</h2>
                <p className="text-slate-600">Tu URL actual no tiene ID. Debería ser algo como: <b>/proyectar/ID_DE_LA_SEDE</b></p>
            </div>
        );
    }

    // Las rutas por sala son exclusivas de las sedes habilitadas para proyección vertical.
    if (sala) {
        if (!usesVerticalProjection) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-center text-white">
                    <div>
                        <h1 className="text-2xl font-bold">Proyección vertical no habilitada</h1>
                        <p className="mt-2 text-slate-300">Esta sede utiliza el formato horizontal.</p>
                    </div>
                </div>
            );
        }

        const roomKey = sala.toUpperCase() as RoomKeys;

        return (
            <div className="h-screen w-screen overflow-hidden bg-black">
                <VistaPreviaTab
                    projectionMode="vertical"
                    fullScreen
                    autoPlay={autoPlay} seconds={seconds}
                    selectedImage={selectedImage} transitionEffect={transitionEffect}
                    mediaItems={mediaItems} obituaries={obituaries as Record<RoomKeys, Obituary>}
                    roomsToShow={[roomKey]}
                    isShowingObituariesPreview={isShowingObituariesPreview}
                    checkIsExpired={checkIsExpired} formatDate={formatDate}
                    formatTime={formatTime} handleCompleteCycle={handleCompleteCycle} />
            </div>
        );
    }

    return (
        

        <div className="min-h-screen p-8 flex flex-col items-center">
   
            {/* Header del Dashboard - Estilo Glassmorphism */}
            <header className="w-full max-w-7xl flex justify-between items-center mb-8 p-4 bg-white/40 backdrop-blur-lg border border-white/60 shadow-xl rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-950 rounded-full flex items-center justify-center border border-white/60 shadow-sm p-1.5">
                        <img src="/imagenes/logo-oficial.webp" alt="JR Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-wider text-slate-800">Aura 2026 - Jardines del Renacer</h1>
                        {sede && <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{sede.nombre}</p>}
                    </div>
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

            {/* Navegación de Vistas (Tabs) */}
            <div className="w-full flex flex-wrap justify-center gap-4 mb-8 border-b border-white/60 pb-8">
                <button
                    onClick={() => setActiveTab('administrar')}
                    className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'administrar' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' : 'bg-white/60 text-slate-700 hover:bg-white/90 shadow-sm'}`}
                >
                Administrar Sala
                </button>
                <button
                    onClick={() => setActiveTab('configuracion')}
                    className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'configuracion' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' : 'bg-white/60 text-slate-700 hover:bg-white/90 shadow-sm'}`}
                >
                Configuración
                </button>
                <button
                    onClick={() => setActiveTab('vista-previa')}
                    className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'vista-previa' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' : 'bg-white/60 text-slate-700 hover:bg-white/90 shadow-sm'}`}
                >
                Vista Previa
                </button>
            </div>

                <div className="w-full flex flex-col gap-8">

                {/* VISTA: CONFIGURACIÓN */}
                {activeTab === 'configuracion' && (
                    <div className="w-full space-y-6 bg-white/50 p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg animate-in fade-in duration-500">
                        <h2 className="text-2xl font-black border-b-2 border-slate-200/60 pb-4 text-slate-800 text-center tracking-wide">⚙️ Ajustes de Proyección</h2>
                        <div className="flex flex-wrap justify-center items-stretch gap-5 mt-8">
                            
                            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group">
                                <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Diseño Pantalla</label>
                                <select value={projectionMode} onChange={(e) => setProjectionMode(e.target.value)} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                                    <option value="classic" className="text-black font-medium">Clásico (Alternado)</option>
                                    {usesVerticalProjection && (
                                        <option value="vertical" className="text-black font-medium">Vertical (Por Sala)</option>
                                    )}
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
                        </div>
                    )}

                    {/* VISTA: ADMINISTRAR SALA */}
                    {activeTab === "administrar" && (
                        <AdministrarTab
                            files={files}
                            setFiles={setFiles}
                            mediaItems={mediaItems}
                            removeImage={removeImage}
                            obituaries={obituaries}
                            handleObituaryChange={handleObituaryChange}
                            roomsToShow={roomsToShow}
                        />
                    )}

                    {/* VISTA: VISTA PREVIA */}
                    {activeTab === 'vista-previa' && (
                    <VistaPreviaTab
                        projectionMode={projectionMode} autoPlay={autoPlay} seconds={seconds}
                        selectedImage={selectedImage} transitionEffect={transitionEffect}
                        mediaItems={mediaItems} obituaries={obituaries as Record<RoomKeys, Obituary>}
                        roomsToShow={roomsToShow}
                        isShowingObituariesPreview={isShowingObituariesPreview}
                        checkIsExpired={checkIsExpired} formatDate={formatDate}
                        formatTime={formatTime} handleCompleteCycle={handleCompleteCycle}
                    />
                    )}


                    

                </div>

                <div className="mt-10 pt-6 border-t border-slate-300 flex justify-end">
                    {usesVerticalProjection ? (
                        <div className="flex flex-wrap gap-4 justify-end">
                            {roomsToShow.map(roomKey => (
                                <button
                                    key={roomKey}
                                    onClick={() => openVerticalProjection(roomKey)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 transform hover:-translate-y-1 transition-all disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                                    disabled={!obituaries[roomKey]?.name && !obituaries[roomKey]?.surname}
                                    title={!obituaries[roomKey]?.name && !obituaries[roomKey]?.surname ? "Debe ingresar datos en el obituario para activar esta sala" : `Proyectar ${roomKey.replace('_', ' ')}`}
                                >
                                    Proyectar {roomKey.replace('_', ' ')}
                                </button>
                            ))}
                            <p className="w-full text-right text-xs text-slate-500 mt-2">
                                Para sedes con proyección vertical, cada sala se abre en una ventana individual.
                                <br/>
                                Los botones de sala se activan al ingresar datos en el obituario correspondiente.
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={() => window.open(`/Pantalla/${presentacionId}`, "_blank")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 transition-all"
                        >
                            Abrir Pantalla de Proyección
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
