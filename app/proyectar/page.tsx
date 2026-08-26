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
import CompartirLinkModal from "./components/CompartirLinkModal";
import AdminSidebar from "./components/AdminSidebar";
import { getRooms } from "@/src/lib/rooms";
import { isObituaryExpired } from "@/src/utils/obituaryAvailability";


// Tipos para los obituarios (se usarán en la Fase 2)
export type Obituary = { name: string, surname: string, dob: string, dod: string, timeStart: string, timeEnd: string, cemetery: string, endTime?: string, endDate?: string, massDate?: string, massTime?: string, massChurch?: string, massChurchType?: string, massAddress?: string };
export type RoomKeys = string;
export type MediaItem = { id: string; url: string; type: string; room: RoomKeys | null; file?: File };

export const emptyObituary = (): Obituary => ({
    name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "",
    endTime: "", endDate: "", massDate: "", massTime: "", massChurch: "", massChurchType: "Parroquia", massAddress: "",
});

export default function Proyectar() {
    
    const params = useParams();
    
    const sedeId = params.id as string; 

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

    const [showCompartir,setShowCompartir]=useState(false);

    const [loaded, setLoaded] = useState(false);

    const [obituarySaveState, setObituarySaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

    const [menuOpen, setMenuOpen] = useState(false);

    const createdRef = useRef(false);

    useEffect(() => {
        const actualizarPresencia = () => {
            fetch("/api/auth/heartbeat", { method: "POST" }).catch(() => {
                // La sesión se valida en el servidor; no se muestra ruido de red al usuario.
            });
        };

        actualizarPresencia();
        const interval = window.setInterval(actualizarPresencia, 5000);

        return () => window.clearInterval(interval);
    }, []);
    
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

            if (data.success) {
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

    const [obituaries, setObituaries] = useState<Record<RoomKeys, Obituary>>({});

    const handleObituaryChange = (room: RoomKeys, field: keyof Obituary, value: string) => {
        setObituaries((prev) => ({
            ...prev,
            [room]: {
                ...(prev[room] ?? emptyObituary()),
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

    const checkIsExpired = (endTime?: string, endDate?: string) =>
        isObituaryExpired(endTime, endDate, currentTime);

    const handleCompleteCycle = useCallback(() => {
        setShowObituariesPreview(true);
    }, []);

    // Toma los datos del usuario MASTER desde sessionStorage para mostrar su email en el header
    interface User{
        id: String;
        email: string;
        role?: string;
        sedeId?: string | null;
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

        ciudad?: string;
        departamento?: string;
        numeroSalas: number;
        salaVip: boolean;
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

            //Configuración
            if (sedeData.configuracion) {
                setAutoplay(sedeData.configuracion.autoPlay);
                setSeconds(sedeData.configuracion.seconds);
                setTransitionEffect(
                    sedeData.configuracion.transitionEffect
                );
            }

            //Obituarios
            {
                const rooms = getRooms(sedeData.numeroSalas, sedeData.salaVip);
                const nuevosObituarios: Record<RoomKeys, Obituary> = Object.fromEntries(
                    rooms.map((room) => [room, emptyObituary()])
                );

                sedeData.obituarios?.forEach((ob: any) => {
                    if (!rooms.includes(ob.sala)) return;
                    nuevosObituarios[ob.sala] = {
                        name: ob.name ?? "",
                        surname: ob.surname ?? "",
                        dob: ob.dob ?? "",
                        dod: ob.dod ?? "", 
                        timeStart: ob.timeStart ?? "",
                        timeEnd: ob.timeEnd ?? "",
                        cemetery: ob.cemetery ?? "",
                        endTime: ob.endTime ?? "",
                        endDate: ob.endDate ?? "",
                        massDate: ob.massDate ?? "",
                        massTime: ob.massTime ?? "",
                        massChurch: ob.massChurch ?? "",
                        massChurchType: ob.massChurchType ?? "Parroquia",
                        massAddress: ob.massAddress ?? "",
                    };
                });

                setObituaries(nuevosObituarios);
            }

            // También habilitamos el guardado para sedes nuevas, que todavía no
            // tienen obituarios creados.
            setLoaded(true);

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

        setRoomsToShow(getRooms(sede.numeroSalas, sede.salaVip));
    }, [sede]);

    // Autoguardado en tiempo real de todos los cambios
    useEffect(() => {
        if (!loaded) return;
        if (!presentacionId) return;
        if (!roomsToShow.length) return;

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
        if (!loaded || !sedeId) return;

        // Evita guardar una versión incompleta por cada pulsación. Así el
        // servidor recibe una única versión coherente cuando el usuario termina.
        let cancelled = false;
        const timer = window.setTimeout(() => {
            void (async () => {
                try {
                    setObituarySaveState("saving");

                    const response = await fetch(`/api/master/obituarios/${sedeId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ obituaries }),
                    });
                    const result = await response.json().catch(() => null);

                    if (!response.ok || !result?.success) {
                        throw new Error(result?.error || "No se pudo guardar el obituario.");
                    }

                    if (!cancelled) setObituarySaveState("saved");
                } catch (error) {
                    console.error("Error al guardar los obituarios:", error);
                    if (!cancelled) setObituarySaveState("error");
                }
            })();
        }, 700);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [loaded, sedeId, obituaries]);

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
        

        <div className="min-h-screen p-3 sm:p-4 md:p-6 flex flex-col items-center">

            {/* Organizar este renderizado */}
            <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} sedeId={sedeId} sede={sede} user={user} onLogout={handleLogout} />

            {/* Header del Dashboard - Estilo Glassmorphism */}
            <header className="mb-4 flex w-full max-w-7xl flex-col gap-3 rounded-2xl border border-white/60 bg-white/40 p-3.5 shadow-xl backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:p-4">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    {/* Hamburguesa */}
                    {/* <button type="button" onClick={() => setMenuOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-blue-950/20 text-slate-200 shadow-sm transition hover:bg-blue-950/30 sm:h-11 sm:w-11">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button> */}

                    
                    <button type="button" onClick={() => setMenuOpen(true)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white-70 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95" aria-label="Abrir menú">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Logo */}
                    {/* <div className="h-11 w-11 shrink-0 rounded-full border border-white/60 bg-blue-950 p-1.5 shadow-sm sm:h-12 sm:w-12">
                        <img src="/imagenes/logo-oficial.webp" alt="JR Logo" className="w-full h-full object-contain" />
                    </div> */}


                    <h1 className="min-w-0 text-xl font-bold leading-tight tracking-wide text-slate-800 sm:text-2xl sm:tracking-wider">Aura 2026 <span className="hidden sm:inline">- </span><span className="block sm:inline">Jardines del Renacer</span></h1>
                </div>
                <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-end sm:gap-3">
                    <span className="min-w-0 truncate text-xs font-medium text-slate-600 sm:max-w-48 sm:text-sm">{user?.email}</span>
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-blue-100 shadow-sm">
                        {/* Avatar dinámico temporal */}
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
                    </div>
                    <button onClick={handleLogout} className="shrink-0 rounded-full border border-red-200 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600 transition-all hover:border-red-300 hover:bg-red-500/20">
                        Salir
                    </button>
                </div>
            </header>

            {/* Contenedor Principal - Estilo Glassmorphism */}
            <div className="w-full max-w-7xl rounded-3xl border border-white/60 bg-white/40 p-4 shadow-2xl backdrop-blur-xl sm:p-5 md:p-6">

            {/* Navegación de Vistas (Tabs) */}
            <div className="mb-6 flex flex-col gap-4 border-b border-slate-200/80 pb-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Sede operativa</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h2 className="text-xl font-black text-slate-800 md:text-2xl">{sede?.nombre ?? "Cargando sede"}</h2>
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                            {roomsToShow.length} {roomsToShow.length === 1 ? "sala" : "salas"} configuradas
                        </span>
                        <span
                            aria-live="polite"
                            className={`text-[11px] font-semibold ${
                                obituarySaveState === "error"
                                    ? "text-red-600"
                                    : obituarySaveState === "saving"
                                        ? "text-amber-600"
                                        : "text-emerald-700"
                            }`}
                        >
                            {obituarySaveState === "saving" && "Guardando cambios…"}
                            {obituarySaveState === "saved" && "Cambios guardados"}
                            {obituarySaveState === "error" && "No se pudo guardar. Intenta nuevamente."}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex w-full gap-1 rounded-2xl border border-slate-200 bg-white/70 p-1.5 shadow-sm sm:w-auto">
                        <button
                            onClick={() => setActiveTab('administrar')}
                            className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:flex-none ${activeTab === 'administrar' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                            Administrar
                        </button>
                        <button
                            onClick={() => setActiveTab('configuracion')}
                            className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:flex-none ${activeTab === 'configuracion' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                            Configuración
                        </button>
                        <button
                            onClick={() => setActiveTab('vista-previa')}
                            className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:flex-none ${activeTab === 'vista-previa' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                            Vista previa
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            if (!isBotonProyectarDisabled) {
                                window.open(`/display/${presentacionId}`, "_blank");
                            }
                        }}
                        disabled={isBotonProyectarDisabled}
                        className={`w-full rounded-xl px-4 py-3 text-sm font-black transition-all sm:w-auto ${isBotonProyectarDisabled ? "cursor-not-allowed bg-slate-200 text-slate-400" : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-xl"}`}
                    >
                        Abrir proyección
                    </button>
                </div>
            </div>

                <div className="w-full flex flex-col gap-8">

                {/* VISTA: CONFIGURACIÓN */}
                {activeTab === 'configuracion' && (
                    <div className="w-full space-y-6 bg-white/50 p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg animate-in fade-in duration-500">
                        {/* <h2 className="text-2xl font-black border-b-2 border-slate-200/60 pb-4 text-slate-800 text-center tracking-wide">⚙️ Ajustes de Proyección</h2> */}

                        <h2 className="text-2xl font-black border-b-2 border-slate-200/60 pb-4 text-slate-800 text-center tracking-wide">Ajustes de Proyección</h2>
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
                            showCompartir={() => setShowCompartir(true)}
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

                
                <CompartirLinkModal
                    open={showCompartir}
                    presentacionId={presentacionId} 
                    onClose={()=>setShowCompartir(false)}
                />
                
                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                    {/* Btn Compartir */}
                    <button
                        onClick={() => setShowCompartir(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all hover:shadow-lg">
                        🔗 Compartir Link
                    </button>

                    {/* Boton Abrir Pantalla */}
                    <button
                        onClick={() => {
                            if (isBotonProyectarDisabled) return;
                            window.open(`/display/${presentacionId}`,"_blank");
                        }}
                        disabled={isBotonProyectarDisabled}
                        className={`font-bold px-8 py-4 rounded-xl transition-all ${isBotonProyectarDisabled ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white shadow-blue-500/30 transform hover:-translate-y-1"}`}
                        title={isBotonProyectarDisabled ? "Debe seleccionar una sala y completar el obituario para proyectar en modo vertical" : "Abrir en una nueva ventana"}>
                            Abrir Pantalla de Proyección
                    </button>
                </div>
            </div>
        </div>
    );
}
