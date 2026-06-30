"use client";
/* eslint-disable @next/next/no-img-element */
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import UploadMedia from "@/components/UploadMedia";
import Slideshow from "@/components/Slideshow";
import VistaPreviaTab from "@/app/proyectar/components/VistaPreviaTab";
import AdministrarTab from "./components/AdministrarTab";
import { isVerticalProjectionSede } from "./projection-config";
import { RootOptions } from "react-dom/client";


// Tipos para los obituarios (se usarán en la Fase 2)
type Obituary = { name: string, surname: string, dob: string, dod: string, timeStart: string, timeEnd: string, cemetery: string, endTime?: string, endDate?: string, massTime?: string, massChurch?: string, massChurchType?: string, massAddress?: string };
export type RoomKeys = "VIP" | "SALA_1" | "SALA_2" | "SALA_3";
export type MediaItem = { id: string; url: string; type: string; room: RoomKeys | null; file?: File };

export default function Proyectar() {
    
    const params = useParams();
    
    const sedeId = params.id as string; 

    console.log("Sede:", sedeId);

    const [ loading, setLoading ] = useState(true);

    const [files, setFiles] = useState<File[]>([]);

    const [savedMedia, setSavedMedia] = useState<MediaItem[]>([]);

   

    const [autoPlay, setAutoplay] = useState(true);

    const [seconds, setSeconds] = useState(10);

    const [selectedImage, setSelectedImage] = useState(0);

    const [transitionEffect, setTransitionEffect] = useState("fade");

    const [projectionMode, setProjectionMode] = useState("classic");

    const [verticalRoom, setVerticalRoom] = useState<RoomKeys | ''>('');

    const [showObituariesPreview, setShowObituariesPreview] = useState(true);

    const [currentTime, setCurrentTime] = useState(() => new Date());

    const router = useRouter();

    const [sede, setSede] = useState<Sede | null>(null);

    const [activeTab, setActiveTab] = useState<'administrar' | 'configuracion' | 'vista-previa'>('administrar');

    const [roomsToShow, setRoomsToShow] = useState<RoomKeys[]>([]);

    const [presentacionId, setPresentacionId] = useState("");

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        console.log("PRESENTACION ID:", presentacionId);
    },[presentacionId])

    const createdRef = useRef(false);
    
    const handleLogout = async () => {
        if (user?.id) {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });
        }

        sessionStorage.removeItem("user");
        
        router.push("/login");
    };

    const crearPresentacion = async () => {
        try {
            const response = await fetch(
                "/api/master/presentaciones", 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre: "Presentación principal",
                        projectionMode: "classic",
                        selectedImage: 0,
                        roomsToShow: [],
                        sedeId,
                    }),
                }
            );

            const data = await response.json();

            console.log("RESPUESTA DEL POST:", data);

            if (data.success) {
                console.log("ID CREADO:", data.id)
                setPresentacionId(data.id);
            }
        } catch (error) {
            console.error(error);
        }
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
    const removeImage = async (indexToRemove: number) => {
        const allMedia = [...savedMedia, ...mediaItems];
        const itemToRemove = allMedia[indexToRemove];

        if (!itemToRemove) return;

        // Si es un archivo guardado (tiene un id que no es un nombre de archivo temporal)
        if (itemToRemove.id && !itemToRemove.file) {
            const response = await fetch(`/api/master/media/${itemToRemove.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setSavedMedia(prev => prev.filter(item => item.id !== itemToRemove.id));
            }
        } else {
            // Si es un archivo nuevo (aún no guardado, identificado por su objeto File)
            setFiles(prev => prev.filter(file => file !== itemToRemove.file));
        }
    };

    const setMediaOrder = (newOrder: MediaItem[]) => {
        // Esta función recibirá el nuevo orden y deberá actualizar el estado.
        // Por ahora, asumimos que la lógica de guardado del orden se manejará
        // en un efecto o al guardar la presentación.
        setSavedMedia(newOrder);
    };

    const mediaItems = useMemo(() => {
        return files.map((file, index) => ({
            id: file.name, // Usamos el nombre como ID temporal
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" : "image",
            room: (file as any).room || null, // Leemos el room que asignamos en UploadMedia
            file: file
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

    interface Sede {
        id: string, //el campo estaba en number, si algo.. se cambia nuevamente
        nombre: string;
    }
  
    const cargarSede = async () => {
        try{
            const resp = await fetch(`/api/master/sedes/${sedeId}`);
            const data = await resp.json();
            
            

            if (!data.ok) return;
            
            const sedeData = data.sede;

            setSede(sedeData);

            const mediaResp = await fetch(`/api/master/media?sedeId=${sedeId}`);

            const mediaData = await mediaResp.json();

            if (mediaData.success) {
                setSavedMedia(mediaData.data);
                setFiles([]); // Limpiamos los archivos locales ya que ahora vienen de la BD
            }

            console.log("SEDE ID URL:", sedeId);
            console.log("SEDE DATA:", sedeData);
            console.log("OBITUARIOS DESDE BD");
            console.log(sedeData.obituarios);

            //Configuración
            if (sedeData.configuracion) {
                setAutoplay(sedeData.configuracion.autoPlay);
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

                sedeData.obituarios.forEach((ob: any) => {
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
                        massChurchType: ob.massChurchType ?? "Parroquia",
                        massAddress: ob.massAddress ?? "",
                    };
                });

                setObituaries(nuevosObituarios);
                setLoaded(true);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!sedeId) {
            setLoading(false);
            return;
        }
        
        cargarSede();
    }, [sedeId]);
    
    useEffect(() => {
        if (!sede) return;

        const rooms: RoomKeys[] = [];

        if (sede.salaVip) {
            rooms.push("VIP");
        }

        for (let i = 1; i <= (sede.numeroSalas ?? 0); i++) {
            rooms.push(`SALA_${i}` as RoomKeys);
        }
        
        setRoomsToShow(rooms);
    }, [sede]);

    // Autoguardado en tiempo real de todos los cambios
    useEffect(() => {
        if (!loaded) return;
        if (!presentacionId) return;
        if (!roomsToShow.length) return;

        console.log("ANTES DEL PATCH");
        console.log("presentacionId =", presentacionId);
        console.log("rooms =", roomsToShow);
        console.log("AUTOGUARDADO");
        console.log(obituaries);
        
        fetch(`/api/master/presentaciones/${presentacionId}`, {
            method: "PATCH",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({
                autoPlay,
                seconds,
                selectedImage,
                obituaries,
                transitionEffect,
                projectionMode,
                verticalRoom,
                roomsToShow,
            }),
        }).then(() => {
            // Notificar a otras pestañas (la pantalla de proyección) que los datos han cambiado.
            localStorage.setItem(`presentacion-update-${presentacionId}`, Date.now().toString());
        });
    }, [
        presentacionId,
        autoPlay,
        seconds,
        selectedImage,
        obituaries,
        transitionEffect,
        projectionMode,
        verticalRoom,
        roomsToShow
    ]);
    
    useEffect(() => {
        if (!sedeId) return;
        if (createdRef.current) return;

        createdRef.current = true;
        crearPresentacion();
    }, [sedeId]);

    useEffect(() => {
        if (!sedeId) return;

        cargarPresentacion();
    }, [sedeId]);

    useEffect(() => {
        if (!sedeId) return;

        fetch(`/api/master/configuracion/${sedeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                autoPlay,
                seconds,
                transitionEffect,
            }),
        });

    }, [
        sedeId,
        autoPlay,
        seconds,
        transitionEffect,
    ]);

    useEffect(() => {
        if (!loaded) return;
        if (!sedeId) return;

        fetch(`/api/master/obituarios/${sedeId}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                obituaries,
            }),
        });
    }, [
        loaded,
        sedeId,
        obituaries,
    ]);

    const cargarPresentacion = async () => {
        const res = await fetch(
            `/api/master/presentaciones?sedeId=${sedeId}`
        );

        const data = await res.json();

        if (data.success && data.data) {
            setPresentacionId(data.data.id);
            setProjectionMode(data.data.projectionMode ?? "classic");
            setVerticalRoom(data.data.verticalRoom ?? (roomsToShow.length > 0 ? roomsToShow[0] : ''));
            setRoomsToShow(data.data.roomsToShow ?? []);
            return;
        }
    }

    const allMedia: MediaItem[] = [...savedMedia, ...mediaItems];

    const isBotonProyectarDisabled = useMemo(() => {
        if (projectionMode === 'vertical') {
            // Si no se ha seleccionado una sala en modo vertical, deshabilita el botón.
            if (!verticalRoom || !roomsToShow.includes(verticalRoom)) {
                return true;
            }
            const obituarySeleccionado = obituaries[verticalRoom];
            // Si la sala seleccionada no tiene ni nombre ni apellido, deshabilita el botón.
            if (!obituarySeleccionado || (!obituarySeleccionado.name?.trim() && !obituarySeleccionado.surname?.trim())) {
                return true;
            }
        }
        return false;
    }, [projectionMode, verticalRoom, obituaries]);

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
                                    {isVerticalProjectionSede(sede?.nombre) && (
                                        <option value="vertical" className="text-black font-medium">Vertical (Sala Única)</option>
                                    )}
                                    <option value="split" className="text-black font-medium">Dividida (L + Publ.)</option>
                                </select>
                            </div>

                            {projectionMode === 'vertical' && (
                                <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center w-full sm:w-[220px] group animate-in fade-in duration-300">
                                    <label className="block font-extrabold mb-3 text-slate-400 group-hover:text-blue-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center transition-colors">Sala a Proyectar</label>
                                    <select value={verticalRoom} onChange={(e) => setVerticalRoom(e.target.value as RoomKeys)} className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-300 p-3 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center text-sm shadow-inner">
                                        <option value="" disabled>-- Seleccione una sala --</option>
                                        {roomsToShow.map(room => (
                                            <option key={room} value={room} className="text-black font-medium">{room === "VIP" ? "Sala VIP" : room.replace("_", " ")}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

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
                            sedeId={sedeId}
                            sede={sede}
                            presentacionId={presentacionId}
                            files={files}
                            setFiles={setFiles}
                            mediaItems={allMedia}
                            removeImage={removeImage}
                            setMediaOrder={setMediaOrder}
                            obituaries={obituaries}
                            onUploadComplete={cargarSede}
                            handleObituaryChange={handleObituaryChange}
                            roomsToShow={roomsToShow}
                        />
                    )}

                    {/* VISTA: VISTA PREVIA */}
                    {activeTab === 'vista-previa' && (
                    <VistaPreviaTab
                        projectionMode={projectionMode} autoPlay={autoPlay} seconds={seconds}
                        selectedImage={selectedImage} transitionEffect={transitionEffect}
                        mediaItems={allMedia} obituaries={obituaries as Record<RoomKeys, Obituary>}
                        verticalRoom={verticalRoom}
                        roomsToShow={roomsToShow}
                        isShowingObituariesPreview={isShowingObituariesPreview}
                        checkIsExpired={checkIsExpired} formatDate={formatDate}
                        formatTime={formatTime} handleCompleteCycle={handleCompleteCycle}
                    />
                    )}


                    

                </div>

                <div className="mt-10 pt-6 border-t border-slate-300 flex justify-end">
                    <button
                        onClick={() => {
                            if (isBotonProyectarDisabled) return;
                            window.open(`/Pantalla/${presentacionId}`, "_blank");
                        }}
                        disabled={isBotonProyectarDisabled}
                        className={`font-bold px-8 py-4 rounded-xl transition-all ${
                            isBotonProyectarDisabled
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                : "bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 transform hover:-translate-y-1"
                        }`}
                        title={isBotonProyectarDisabled ? "Debe seleccionar una sala y completar el obituario para proyectar en modo vertical" : "Abrir en una nueva ventana"}
                    >
                        Abrir Pantalla de Proyección
                    </button>
                </div>
            </div>
        </div>
    );
}
