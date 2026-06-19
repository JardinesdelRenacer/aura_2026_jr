import React from "react";
import UploadMedia from "@/components/UploadMedia";
import { Obituary, RoomKeys } from "../page";

interface AdministrarTabProps {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    mediaItems: { url: string; type: string }[];
    removeImage: (index: number) => void;
    obituaries: Record<RoomKeys, Obituary>;
    handleObituaryChange: (room: RoomKeys, field: keyof Obituary, value: string) => void;
    roomsToShow: RoomKeys[];
}

export default function AdministrarTab({
    files, setFiles, mediaItems, removeImage, obituaries, handleObituaryChange, roomsToShow
}: AdministrarTabProps) {
    return (
        <>
            <div className="p-6 md:p-8 bg-white/50 rounded-[2rem] border border-white/60 shadow-lg animate-in fade-in duration-500">
                <h2 className="text-2xl font-black border-b-2 border-slate-200/60 pb-4 text-slate-800 text-center tracking-wide mb-6">📸 Carga de Archivos Multimedia</h2>
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

            {/* Sección 2: Obituarios */}
            <div className="w-full space-y-6 bg-white/50 p-6 rounded-2xl border border-white/60 flex flex-col shadow-sm mt-8 animate-in fade-in duration-500">
                <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">🕊️ Gestión de Obituarios</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
                    {roomsToShow.map((room) => (
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
        </>
    );
}