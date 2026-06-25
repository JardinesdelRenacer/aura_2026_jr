import React from "react";
import Slideshow from "@/components/Slideshow";
import type { Obituary, RoomKeys } from "@/app/proyectar/page";
import ObituarioVertical from "../ObituarioVertical";

interface VistaPreviaTabProps {
    projectionMode: string;
    fullScreen?: boolean;
    autoPlay: boolean;
    seconds: number;
    selectedImage: number;
    transitionEffect: string;
    mediaItems: { url: string; type: string }[];
    obituaries: Record<RoomKeys, Obituary>;
    roomsToShow: RoomKeys[];
    isShowingObituariesPreview: boolean;
    checkIsExpired: (endTime?: string, endDate?: string) => boolean;
    formatDate: (dateString: string) => string;
    formatTime: (timeStr?: string) => string;
    handleCompleteCycle: () => void;
}

export default function VistaPreviaTab({
    projectionMode, fullScreen = false, autoPlay, seconds, selectedImage, transitionEffect,
    mediaItems, obituaries, roomsToShow, isShowingObituariesPreview,
    checkIsExpired, formatDate, formatTime, handleCompleteCycle
}: VistaPreviaTabProps) {
    const isVertical = projectionMode === "vertical";
    const containerClassName = fullScreen
        ? "w-full h-full flex items-center justify-center overflow-hidden bg-black"
        : "w-full h-full space-y-6 bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm animate-in fade-in duration-500";
    const screenClassName = isVertical
        ? fullScreen
            ? "h-full max-w-full aspect-[9/16] bg-black overflow-hidden relative"
            : "w-full max-w-md mx-auto aspect-[9/16] bg-black rounded-3xl overflow-hidden relative border-4 border-white shadow-2xl"
        : "w-full aspect-video bg-white/80 rounded-3xl overflow-hidden relative border-4 border-white shadow-2xl scale-100 transform origin-top";

    return (
        <div className={containerClassName}>
            {!isVertical && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-slate-200 pb-4 gap-2">
                    <h2 className="text-2xl font-bold text-slate-800">👁️ Vista Previa en Vivo</h2>
                    <p className="text-sm text-blue-800 bg-blue-100/80 px-3 py-1 rounded-full shadow-inner border border-blue-200">Simulación a escala (Ciclo 30s)</p>
                </div>
            )}

            {/* Contenedor que simula la pantalla de proyección a escala */}
            <div className={screenClassName}>
                {isVertical ? (
                    (() => {
                        const roomKey = roomsToShow[0];
                        const obituary = obituaries[roomKey];
                        return (
                            <div className="flex h-full w-full flex-col gap-3 bg-slate-950 p-3">
                                <div className="relative h-3/5 flex-grow overflow-hidden rounded-[1.75rem] border border-white/20 shadow-2xl">
                                    <Slideshow media={mediaItems} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} transitionEffect={transitionEffect} onCompleteCycle={handleCompleteCycle} />
                                </div>
                                <div className="h-2/5 flex-shrink-0 overflow-hidden rounded-[1.75rem] border-2 border-white/70 shadow-2xl ring-1 ring-blue-200/30">
                                    <ObituarioVertical obituary={obituary} formatDate={formatDate} formatTime={formatTime} />
                                </div>
                            </div>
                        );
                    })()
                ) : projectionMode === "split" ? (
                    <div className="h-full w-full bg-linear-to-br from-white/60 via-blue-50/50 to-white/40 p-1.5 backdrop-blur-2xl sm:p-2">
                        <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-1.5 sm:gap-2">
                            {/* Media Slider en Top Right */}
                            <div className="relative col-span-2 col-start-2 row-start-1 h-full min-h-0 w-full min-w-0 overflow-hidden rounded-xl border border-white/80 bg-[url('/imagenes/New_wallpaper.png')] bg-cover bg-center shadow-xl sm:rounded-2xl">
                                <div className="absolute inset-0">
                                    <Slideshow media={mediaItems} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} transitionEffect={transitionEffect} />
                                </div>
                            </div>

                            {/* Obituarios en Forma de L */}
                            {roomsToShow
                                .map((roomKey) => {
                                    const ob = obituaries[roomKey];

                                    const expired = checkIsExpired(ob.endTime, ob.endDate);
                                    const isActive = Boolean((ob.name || ob.surname) && !expired);
                                    return { roomKey, ob, isActive };
                                })
                                .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                                .map(({ roomKey, ob, isActive }, index) => {
                                    const slotClasses = ["col-start-1 row-start-1", "col-start-1 row-start-2", "col-start-2 row-start-2", "col-start-3 row-start-2"];
                                    return (
                                        <div key={roomKey} className={`${slotClasses[index]} relative flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-start overflow-hidden rounded-lg border border-white/30 bg-[url('/imagenes/New_wallpaper.png')] bg-size-[100%_100%] bg-no-repeat text-center shadow-lg sm:rounded-xl`}>
                                            <div className="absolute inset-0 flex flex-col items-center justify-start p-2 text-center sm:p-3">
                                                <h2 className="mb-1.5 w-4/5 border-b border-black/20 pb-1 text-xs font-bold uppercase tracking-widest text-black [text-shadow:0_1px_2px_rgb(255_255_255)] sm:text-base">
                                                    {roomKey === "VIP" ? "Sala VIP" : roomKey.replace("_", " ")}
                                                </h2>

                                                {isActive ? (
                                                    <div className="flex flex-col grow w-full justify-center items-center z-10 overflow-hidden">
                                                        <h3 className="mb-1 w-full truncate px-1 text-base font-extrabold text-black [text-shadow:0_1px_2px_rgb(255_255_255)] sm:text-2xl">{ob.name}</h3>
                                                        <h3 className="mb-1.5 w-full truncate px-1 text-sm font-bold text-black/90 [text-shadow:0_1px_2px_rgb(255_255_255)] sm:text-xl">{ob.surname}</h3>

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
                                                        <p className="truncate text-sm font-bold uppercase tracking-widest text-black/40 [text-shadow:0_1px_2px_rgb(255_255_255)] sm:text-xl">Sala Disponible</p>
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
                        {roomsToShow
                            .map((roomKey) => {
                                const ob = obituaries[roomKey];

                                const expired = checkIsExpired(ob.endTime, ob.endDate);
                                const isActive = Boolean((ob.name || ob.surname) && !expired);
                                return { roomKey, ob, isActive };
                            })
                            .sort((a, b) => Number(b.isActive) - Number(a.isActive))
                            .map(({ roomKey, ob, isActive }) => (
                                <div key={roomKey} className="bg-[url('/imagenes/Fondo_c4r0.jpeg')] bg-size-[100%_100%] bg-no-repeat border border-white/20 rounded-2xl p-6 flex flex-col justify-start items-center text-center shadow-xl relative overflow-hidden">
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
                        <Slideshow media={mediaItems} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage} onCompleteCycle={handleCompleteCycle} transitionEffect={transitionEffect} />
                    </div>
                )}
            </div>
        </div>
    );
}
