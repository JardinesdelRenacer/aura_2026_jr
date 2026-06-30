import React, { useState, useCallback } from "react";
import UploadMedia from "@/components/UploadMedia";
import type { Obituary, RoomKeys, MediaItem } from "@/app/proyectar/page";
import { isVerticalProjectionSede } from "../projection-config";

interface AdministrarTabProps {
    sedeId: string;
    sede: { nombre: string } | null;
    presentacionId: string;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    mediaItems: MediaItem[];
    removeImage: (index: number) => void; // Cambiado de removeMedia a removeImage
    onUploadComplete: () => void;
    setMediaOrder: (newOrder: MediaItem[]) => void;
    obituaries: Record<RoomKeys, Obituary>;
    handleObituaryChange: (room: RoomKeys, field: keyof Obituary, value: string) => void;
    roomsToShow: RoomKeys[];
    showCompartir: () => void;
}

export default function AdministrarTab({
    sedeId, sede, presentacionId, files, setFiles, mediaItems, removeImage, onUploadComplete, setMediaOrder, obituaries, handleObituaryChange, roomsToShow, showCompartir
}: AdministrarTabProps) {
    const esSedeVertical = isVerticalProjectionSede(sede?.nombre);
    const [notificacionesLimpieza, setNotificacionesLimpieza] = useState<Record<string, boolean>>({});
    const [confirmModalState, setConfirmModalState] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; } | null>(null);

    const handleRemove = useCallback((index: number) => {
        setConfirmModalState({
            isOpen: true,
            title: "Confirmar Eliminación",
            message: "¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.",
            onConfirm: () => removeImage(index),
        });
    }, [removeImage]);

    const executeLimpiarDatos = (room: RoomKeys) => {
            // Limpieza completa de todos los campos del obituario
            handleObituaryChange(room, "name", "");
            handleObituaryChange(room, "surname", "");
            handleObituaryChange(room, "dob", "");
            handleObituaryChange(room, "dod", "");
            handleObituaryChange(room, "cemetery", "");
            handleObituaryChange(room, "timeStart", "");
            handleObituaryChange(room, "timeEnd", "");
            handleObituaryChange(room, "endTime", "");
            handleObituaryChange(room, "endDate", "");
            handleObituaryChange(room, "massTime", "");
            handleObituaryChange(room, "massChurch", "");
            handleObituaryChange(room, "massChurchType", "Parroquia");
            handleObituaryChange(room, "massAddress", "");

            // Limpieza de la multimedia asociada a la sala
            const indicesAEliminar: number[] = [];
            mediaItems.forEach((item, index) => {
                if (item.room === room) {
                    indicesAEliminar.push(index);
                }
            });

            // Eliminar en orden inverso para no afectar los índices
            indicesAEliminar.reverse().forEach(index => {
                removeImage(index);
            });

            setNotificacionesLimpieza(prev => ({ ...prev, [room]: true }));
            setTimeout(() => setNotificacionesLimpieza(prev => ({ ...prev, [room]: false })), 3000);
    };

    const handleLimpiarDatos = useCallback((room: RoomKeys) => {
        setConfirmModalState({
            isOpen: true,
            title: `Limpiar Sala ${room.replace("_", " ")}`,
            message: `¿Estás seguro de que deseas limpiar TODOS los datos y la multimedia de la sala ${room.replace("_", " ")}? Esta acción no se puede deshacer.`,
            onConfirm: () => executeLimpiarDatos(room),
        });
    }, [mediaItems, handleObituaryChange, removeImage]);

    const closeConfirmModal = () => {
        if (confirmModalState) {
            setConfirmModalState({ ...confirmModalState, isOpen: false });
        }
    };

    return (
        <>
            {!esSedeVertical && (
                <div className="p-6 md:p-8 bg-white/50 rounded-[2rem] border border-white/60 shadow-lg animate-in fade-in duration-500">
                    <h2 className="text-2xl font-black border-b-2 border-slate-200/60 pb-4 text-slate-800 text-center tracking-wide mb-6">📸 Carga de Archivos Multimedia</h2>
                    <UploadMedia sedeId={sedeId} setFiles={setFiles} onUploadComplete={onUploadComplete} /> 
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-5">
                        {mediaItems.map((item, index) => (
                            // Solo mostramos items que no tienen un 'room' asignado (multimedia general)
                            !item.room && (
                                <div
                                    key={item.id || item.url}
                                    className="relative group cursor-move"
                                    draggable
                                    onDragStart={(e) => { e.dataTransfer.setData("mediaIndex", index.toString()); }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        const draggedIndex = Number(e.dataTransfer.getData("mediaIndex"));
                                        const newOrder = [...mediaItems];
                                        const [draggedItem] = newOrder.splice(draggedIndex, 1);
                                        newOrder.splice(index, 0, draggedItem);
                                        setMediaOrder(newOrder);
                                    }}
                                >
                                    {item.type === "video" ? (
                                        <video src={item.url} className="w-full h-32 object-contain rounded-lg bg-slate-800 border border-white/20 shadow-md" />
                                    ) : (
                                        <img src={item.url} alt={`media-${index}`} className="w-full h-32 object-contain rounded-lg bg-slate-800 border border-white/20 shadow-md" />
                                    )}
                                    <button onClick={() => handleRemove(index)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Sección 2: Obituarios */}
            <div className="w-full space-y-6 bg-white/50 p-6 rounded-2xl border border-white/60 flex flex-col shadow-sm mt-8 animate-in fade-in duration-500">
                <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">🕊️ Gestión de Obituarios</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
                    {(roomsToShow ?? []).map((room) => (
                        <div key={room} className="p-6 bg-white/60 rounded-2xl border border-white/60 shadow-md flex flex-col gap-4">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <h3 className="text-xl font-bold text-blue-700">
                                    {room === "VIP" ? "Sala VIP" : room.replace("_", " ")}
                                </h3>
                                { (obituaries[room].name || obituaries[room].surname) && (
                                    <button
                                        onClick={() => {
                                            window.open(`/Pantalla/${presentacionId}?room=${room}`, "_blank");
                                        }}
                                        className="bg-blue-100/80 text-blue-700 hover:bg-blue-200/80 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                                        title={`Abrir proyección individual para ${room.replace("_", " ")}`}
                                    >
                                        Proyectar
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-700">Nombre(s)</label>
                                    <input type="text" value={obituaries[room].name} onChange={(e) => handleObituaryChange(room, "name", e.target.value)} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 shadow-inner" placeholder="Ej: Juan" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-700">Apellido(s)</label>
                                    <input type="text" value={obituaries[room].surname} onChange={(e) => handleObituaryChange(room, "surname", e.target.value)} className="w-full bg-white/70 border border-white/60 p-2.5 rounded-lg text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 shadow-inner" placeholder="Ej: Pérez" />
                                </div>
                                {esSedeVertical && (
                                    <div className="sm:col-span-2 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50 space-y-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-800 mb-3">Multimedia para {room.replace("_", " ")}</h4>
                                        <UploadMedia sedeId={sedeId} setFiles={setFiles} room={room} onUploadComplete={onUploadComplete} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-5">
                                            {mediaItems.map((item, index) => (
                                                // Solo mostramos items que pertenecen a esta sala
                                                item.room === room && (
                                                    <div
                                                        key={item.id || item.url}
                                                        className="relative group cursor-move"
                                                        draggable
                                                        onDragStart={(e) => { e.dataTransfer.setData("mediaIndex", index.toString()); }}
                                                        onDragOver={(e) => e.preventDefault()}
                                                        onDrop={(e) => {
                                                            const draggedIndex = Number(e.dataTransfer.getData("mediaIndex"));
                                                            const newOrder = [...mediaItems];
                                                            const [draggedItem] = newOrder.splice(draggedIndex, 1);
                                                            newOrder.splice(index, 0, draggedItem);
                                                            setMediaOrder(newOrder);
                                                        }}
                                                    >
                                                        {item.type === "video" ? (
                                                            <video src={item.url} className="w-full h-32 object-contain rounded-lg bg-slate-800 border border-white/20 shadow-md" />
                                                        ) : (
                                                            <img src={item.url} alt={`media-${index}`} className="w-full h-32 object-contain rounded-lg bg-slate-800 border border-white/20 shadow-md" />
                                                        )}
                                                        <button onClick={() => handleRemove(index)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                        {notificacionesLimpieza[room] ? (
                                            <div className="relative flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-100/80 px-4 py-2 rounded-full border border-blue-200/80 shadow-lg animate-in fade-in zoom-in-95 duration-300">
                                                <div className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-bl-full animate-[progress_3s_ease-out_forwards]" style={{'--tw-translate-x': '-100%'}}></div>
                                                <style>{`@keyframes progress { to { transform: translateX(0); } }`}</style>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span>Datos y Multimedia Limpiados</span>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => handleLimpiarDatos(room)} className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors border border-red-200">
                                                Limpiar Horarios / Datos
                                            </button>
                                        )}
                                        <button
                                            onClick={showCompartir}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-md transition"
                                        >
                                            🔗 Compartir Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Confirmación */}
            {confirmModalState?.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">{confirmModalState.title}</h2>
                        <p className="text-slate-600 mb-8">{confirmModalState.message}</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeConfirmModal}
                                className="px-6 py-2 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    confirmModalState.onConfirm();
                                    closeConfirmModal();
                                }}
                                className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-500/30"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}