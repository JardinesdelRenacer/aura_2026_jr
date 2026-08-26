"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Slideshow from "@/components/Slideshow";
import ObituarioVertical from "@/app/proyectar/ObituarioVertical";
import { isObituaryExpired } from "@/src/utils/obituaryAvailability";

type RoomKeys = string;

type MediaItem = {
    url: string;
    type: string;
    room?: string | null;
};

type Obituary = {
    name: string;
    surname: string;
    dob: string;
    dod: string;
    timeStart: string;
    timeEnd: string;
    cemetery: string;
    endTime?: string;
    endDate?: string;
    massTime?: string;
    massChurch?: string;
    massChurchType?: string;
    massAddress?: string;
};

type ObituariesData = Record<RoomKeys, Obituary>;

const emptyObituary = (): Obituary => ({
    name: "", surname: "", dob: "", dod: "", timeStart: "", timeEnd: "", cemetery: "",
    endTime: "", endDate: "", massTime: "", massChurch: "", massChurchType: "Parroquia", massAddress: "",
});

interface PantallaViewProps {
    presentacionId?: string;
    preview?: boolean;
}

export default function PantallaView({
    presentacionId,
    preview = false,
}: PantallaViewProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [allMedia, setAllMedia] = useState<MediaItem[]>([]);

    const [autoPlay, setAutoplay] = useState(true);
    const [seconds, setSeconds] = useState(10);
    const [selectedImage, setSelectedImage] = useState(0);
    const [transitionEffect, setTransitionEffect] = useState("fade");
    const [projectionMode, setProjectionMode] = useState("classic");

    const [verticalRoom, setVerticalRoom] = useState<RoomKeys | "">("");
    const [obituaries, setObituaries] =
        useState<ObituariesData | null>(null);

    const [showObituaries, setShowObituaries] = useState(true);
    const [currentTime, setCurrentTime] = useState(() => new Date());
    const [roomsToShow, setRoomsToShow] = useState<string[]>([]);
    const [sedeId, setSedeId] = useState("");

    const searchParams = useSearchParams();

    const roomParam = searchParams.get("room") as RoomKeys | null;
    const pantallaToken = searchParams.get("token");
    const [screenRegistered, setScreenRegistered] = useState(false);

    const convertirObituarios = useCallback(
        (listas: any[]): ObituariesData => {
            const resultado: ObituariesData = {};

            listas.forEach((obituario) => {
                const sala = obituario.sala as RoomKeys;

                resultado[sala] = { ...emptyObituary(), ...obituario };
            });

            return resultado;
        },
        []
    );

    const cargarPresentacion = useCallback(async () => {
        try {
            if (!presentacionId) return;

            const response = await fetch(
                `/api/master/presentaciones/${presentacionId}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                console.error(
                    "No se pudo cargar la presentación:",
                    result.error
                );
                return;
            }

            const presentacion = result.data;
            const sede = presentacion.sede ?? {};

            const rooms = Array.isArray(presentacion.roomsToShow)
                ? presentacion.roomsToShow
                : [];

            const mediaList: MediaItem[] = Array.isArray(sede.media)
                ? sede.media
                : [];

            setSedeId(sede.id ?? "");
            setProjectionMode(
                presentacion.projectionMode || "classic"
            );
            setSelectedImage(presentacion.selectedImage ?? 0);
            setRoomsToShow(rooms);
            setAllMedia(mediaList);

            setObituaries(
                convertirObituarios(
                    Array.isArray(sede.obituarios)
                        ? sede.obituarios
                        : []
                )
            );

            if (sede.configuracion) {
                setAutoplay(
                    sede.configuracion.autoPlay ?? true
                );
                setSeconds(
                    sede.configuracion.seconds ?? 10
                );
                setTransitionEffect(
                    sede.configuracion.transitionEffect ??
                        "fade"
                );
            }
        } catch (error) {
            console.error(
                "Error cargando presentación:",
                error
            );
        }
    }, [presentacionId, convertirObituarios]);

    const cargarConfiguracionPantalla =
        useCallback(async () => {
            try {
                if (preview) return;

                const query = pantallaToken
                    ? `?token=${encodeURIComponent(
                          pantallaToken
                      )}`
                    : "";

                const response = await fetch(
                    `/api/pantalla/configuracion${query}`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    // La vista abierta desde el panel de administración es una
                    // previsualización autenticada, no una pantalla física.
                    // En ese caso no hay token ni se debe reportar heartbeat.
                    if (response.status === 400 || response.status === 401) {
                        setScreenRegistered(false);
                        return;
                    }
                    console.error(
                        "No se pudo cargar la configuración de pantalla:",
                        result.error
                    );
                    return;
                }

                setVerticalRoom(
                    result.data.verticalRoom ?? ""
                );
                setScreenRegistered(true);
            } catch (error) {
                console.error(
                    "Error cargando configuración de pantalla:",
                    error
                );
            }
        }, [preview, pantallaToken]);

    useEffect(() => {
        if (projectionMode !== "vertical") {
            setMedia(allMedia);
            return;
        }

        // La configuración guardada de la pantalla tiene prioridad.
        const roomKey =
            verticalRoom ||
            roomParam ||
            (roomsToShow[0] as RoomKeys | undefined);

        if (!roomKey) {
            setMedia(
                allMedia.filter((item) => !item.room)
            );
            return;
        }

        const roomMedia = allMedia.filter(
            (item) => item.room === roomKey
        );

        const generalMedia = allMedia.filter(
            (item) => !item.room
        );

        setMedia(
            roomMedia.length > 0
                ? roomMedia
                : generalMedia
        );
    }, [
        allMedia,
        projectionMode,
        roomParam,
        verticalRoom,
        roomsToShow,
    ]);

    useEffect(() => {
        const timer = window.setInterval(
            () => setCurrentTime(new Date()),
            10000
        );

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!presentacionId) return;

        let active = true;

        const actualizarPantalla = async () => {
            if (!active) return;

            await Promise.all([
                cargarPresentacion(),
                cargarConfiguracionPantalla(),
            ]);
        };

        actualizarPantalla();

        const interval = window.setInterval(
            actualizarPantalla,
            3000
        );

        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, [
        presentacionId,
        cargarPresentacion,
        cargarConfiguracionPantalla,
    ]);

    useEffect(() => {
        if (preview || !sedeId || !screenRegistered) return;

        const enviarHeartbeat = async () => {
            try {
                const response = await fetch(
                    "/api/pantalla/heartbeat",
                    {
                        method: "PUT",
                        credentials: "include",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            sedeId,
                            ...(pantallaToken ? { token: pantallaToken } : {}),
                            screen: {
                                width: window.screen.width,
                                height: window.screen.height,
                            },
                            viewport: {
                                width: window.innerWidth,
                                height: window.innerHeight,
                            },
                            userAgent:
                                navigator.userAgent,
                            language:
                                navigator.language,
                            online:
                                navigator.onLine,
                        }),
                    }
                );

                if (!response.ok) {
                    console.error(
                        "Heartbeat rechazado:",
                        response.status
                    );
                }
            } catch (error) {
                console.error(
                    "Error enviando heartbeat:",
                    error
                );
            }
        };

        enviarHeartbeat();

        const interval = window.setInterval(
            enviarHeartbeat,
            5000
        );

        return () => window.clearInterval(interval);
    }, [preview, sedeId, pantallaToken, screenRegistered]);

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
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
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
    const checkIsExpired = (endTime?: string, endDate?: string) =>
        isObituaryExpired(endTime, endDate, currentTime);

    const handleCompleteCycle = useCallback(() => {
        setShowObituaries(true);
    }, []);


    if (!obituaries) return <div className="w-screen h-screen bg-blue-50 flex items-center justify-center text-blue-800 font-bold text-2xl">Cargando presentación...</div>;

    const splitItems = roomsToShow.length + 1;
    const splitColumns = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(splitItems))));
    const splitRows = Math.ceil(splitItems / splitColumns);
    const obituaryColumns = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(roomsToShow.length))));
    const obituaryRows = Math.ceil(Math.max(roomsToShow.length, 1) / obituaryColumns);

    if (projectionMode === "vertical" ) {
        const roomKey = verticalRoom || roomParam || (roomsToShow[0] as RoomKeys);
        const obituary = roomKey ? obituaries[roomKey] : null;

        const expired = obituary ? checkIsExpired(obituary.endTime, obituary.endDate) : false;

        const isActive = Boolean(
            obituary &&
                (obituary.name?.trim() || obituary.surname?.trim()) && !expired
        );

        return (
            <div className="w-screen h-screen flex items-center justify-center overflow-hidden bg-black">
                <div className="h-full max-w-full aspect-[9/16] bg-black overflow-hidden relative">
                    {roomKey ? (
                        <div className="flex h-full w-full flex-col gap-3 bg-slate-950 p-3">
                            <div className="relative h-3/5 flex-grow overflow-hidden rounded-[1.75rem] border border-white/20 shadow-2xl">
                                <Slideshow media={media} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} transitionEffect={transitionEffect} onCompleteCycle={handleCompleteCycle} />
                            </div>

                            {/* información del obituario */}
                            <div className="h-2/5 flex-shrink-0 overflow-hidden rounded-[1.75rem] border-2 border-white/70 shadow-2xl ring-1 ring-blue-200/30">
                                {isActive && obituary ? (
                                    <ObituarioVertical obituary={obituary} formatDate={formatDate} formatTime={formatTime} />
                                ): (
                                    <div className="flex h-full flex-col items-center justify-center bg-[url('/imagenes/35.png')] bg-cover bg-center px-8 text-center px-8 text-center">
                                        <h2 className="text-4xl font-black uppercase tracking-[0.15em] text-black">
                                            {roomKey === "VIP"
                                                ? "Sala VIP"
                                                : roomKey.replace(
                                                    "-",
                                                    " "
                                                )}
                                        </h2>

                                        <div className="my-6 h-px w-2/3 bg-black/20" />

                                        <p className="text-3xl font-bold uppercase tracking-widest text-black/50">
                                            Sala Disponible
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-800 text-white/50">
                            <p className="text-2xl font-bold">No se ha seleccionado una sala para proyectar.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }


    // RENDERIZADO EN MODO PANTALLA DIVIDIDA (L + PUBLICIDAD)
    if (projectionMode === "split") {
        return (
            <div className="w-screen h-screen bg-blue-50 overflow-hidden relative font-sans">
                <div className="w-full h-full p-4 sm:p-6 lg:p-8 bg-linear-to-br from-white/60 via-blue-50/50 to-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.1)]">
                    <div className="grid h-full w-full gap-4 sm:gap-6 lg:gap-8" style={{ gridTemplateColumns: `repeat(${splitColumns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${splitRows}, minmax(0, 1fr))` }}>
                        <div className="min-h-0 min-w-0 h-full w-full rounded-4xl overflow-hidden relative shadow-2xl border border-white/80 bg-white/40">
                            <div className="absolute inset-0">
                                <Slideshow media={media} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} transitionEffect={transitionEffect} />
                            </div>
                        </div>

                        {/* Obituarios en Forma de L */}
                        {roomsToShow
                            .map((roomKey) => {
                                const ob = obituaries[roomKey] ?? emptyObituary();

                                const expired = checkIsExpired(ob.endTime, ob.endDate);
                                const isActive = Boolean((ob.name || ob.surname) && !expired);
                                return { roomKey, ob, isActive };
                            })
                            .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                            .map(({ roomKey, ob, isActive }) => {
                                return (
                                    <div key={roomKey} className="min-h-0 min-w-0 h-full w-full bg-[url('/imagenes/35.png')] bg-size-[100%_100%] bg-no-repeat border border-white/20 rounded-4xl shadow-2xl relative overflow-hidden">
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
                                                        {(ob.timeStart || ob.timeEnd || ob.endDate || ob.endTime) && (
                                                            <div className="bg-white/30 border border-black/10 rounded-xl sm:rounded-2xl p-1.5 lg:p-3 backdrop-blur-md shadow-xl flex flex-col justify-center overflow-hidden">
                                                                <p className="text-black/80 text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest mb-0.5 sm:mb-1 font-bold [text-shadow:0_1px_3px_rgb(255_255_255)] truncate">Inicio</p>
                                                                <p className="text-xs sm:text-base lg:text-lg font-bold text-black [text-shadow:0_1px_5px_rgb(255_255_255)] truncate">
                                                                    {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                                </p>
                                                                {(ob.endDate || ob.endTime) && <p className="mt-1 truncate text-[10px] font-semibold text-black/75">Finaliza: {ob.endDate && formatDate(ob.endDate)} {ob.endTime && formatTime(ob.endTime)}</p>}
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
                <div className="grid h-full w-full gap-3 border border-white/80 bg-linear-to-br from-white/60 via-blue-50/50 to-white/40 p-3 shadow-[inset_0_0_20px_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-2xl sm:gap-4 sm:p-4 md:gap-5 md:p-5 lg:gap-6 lg:p-6" style={{ gridTemplateColumns: `repeat(${obituaryColumns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${obituaryRows}, minmax(0, 1fr))` }}>
                    {roomsToShow
                        .map((roomKey) => {
                            const ob = obituaries[roomKey] ?? emptyObituary();

                            const expired = checkIsExpired(ob.endTime, ob.endDate);
                            const isActive = Boolean((ob.name || ob.surname) && !expired);
                            return { roomKey, ob, isActive };
                        })
                        .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                        .map(({ roomKey, ob, isActive }) => (
                            <div key={roomKey} className="bg-[url('/imagenes/35.png')] bg-size-[100%_100%] bg-no-repeat border border-white/20 rounded-2xl sm:rounded-3xl lg:rounded-4xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-start items-center text-center shadow-2xl relative overflow-hidden">
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
                                            {(ob.timeStart || ob.timeEnd || ob.endDate || ob.endTime) && (
                                                <div className="bg-white/30 border border-black/10 rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 md:p-2 lg:p-3 backdrop-blur-md shadow-xl flex flex-col justify-center overflow-hidden">
                                                    <p className="text-black/80 text-[10px] sm:text-xs md:text-sm lg:text-sm uppercase tracking-widest mb-0.5 sm:mb-1 md:mb-1 lg:mb-1 font-bold [text-shadow:0_1px_3px_rgb(255_255_255)] truncate">Inicio</p>
                                                    <p className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-black [text-shadow:0_1px_5px_rgb(255_255_255)] truncate">
                                                        {ob.timeStart && formatTime(ob.timeStart)} {ob.timeStart && ob.timeEnd && "-"} {ob.timeEnd && formatTime(ob.timeEnd)}
                                                    </p>
                                                    {(ob.endDate || ob.endTime) && <p className="mt-1 truncate text-[10px] font-semibold text-black/75">Finaliza: {ob.endDate && formatDate(ob.endDate)} {ob.endTime && formatTime(ob.endTime)}</p>}
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
