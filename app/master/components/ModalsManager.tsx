import React from "react";
import { PantallaEscalada } from "./PantallaEscalada";
import { ubicaciones } from "@/src/data/ubicaciones";

interface ModalsManagerProps {
    departamentos: string[];
    ciudadesDisponibles: string[];
    sedes: any[];
    usuarios: any[];

    showModalAdmin: boolean; setShowModalAdmin: (show: boolean) => void;
    nombres: string; setNombres: (val: string) => void;
    apellidos: string; setApellidos: (val: string) => void;
    cedula: string; setCedula: (val: string) => void;
    telefono: string; setTelefono: (val: string) => void;
    email: string; setEmail: (val: string) => void;
    password: string; setPassword: (val: string) => void;
    departamento: string; setDepartamento: (val: string) => void;
    ciudad: string; setCiudad: (val: string) => void;
    nombreSede: string; setNombreSede: (val: string) => void;
    crearAdministrador: () => void;

    showModalSede: boolean; setShowModalSede: (show: boolean) => void;
    nuevaSedeNombre: string; setNuevaSedeNombre: (val: string) => void;
    nuevaSedeDepartamento: string; setNuevaSedeDepartamento: (val: string) => void;
    nuevaSedeCiudad: string; setNuevaSedeCiudad: (val: string) => void;
    nuevaSedeAdminId: string; setNuevaSedeAdminId: (val: string) => void;
    nuevaSedeNumeroSalas: string; setNuevaSedeNumeroSalas: (val: string) => void;
    nuevaSedeVip: boolean; setNuevaSedeVip: (val: boolean) => void;
    crearSede: () => void;

    expandedSede: any; setExpandedSede: (sede: any) => void;
    userToEdit: any; setUserToEdit: (user: any) => void; guardarEdicionUsuario: () => void;
    userToSuspend: string | null; setUserToSuspend: (userId: string | null) => void; suspenderUsuario: () => void;
    userToDelete: string | null; setUserToDelete: (userId: string | null) => void; eliminarUsuario: () => void;
    successMessage: string | null; setSuccessMessage: (msg: string | null) => void;
    notification: { show: boolean; message: string; type: "success" | "error" }; setNotification: (notif: { show: boolean; message: string; type: "success" | "error" }) => void;
    isLoading: boolean;
}

export function ModalsManager({
    departamentos, ciudadesDisponibles, sedes, usuarios,
    showModalAdmin, setShowModalAdmin, nombres, setNombres, apellidos, setApellidos, cedula, setCedula, telefono, setTelefono, email, setEmail, password, setPassword, departamento, setDepartamento, ciudad, setCiudad, nombreSede, setNombreSede, crearAdministrador,
    showModalSede, setShowModalSede, nuevaSedeNombre, setNuevaSedeNombre, nuevaSedeDepartamento, setNuevaSedeDepartamento, nuevaSedeCiudad, setNuevaSedeCiudad, nuevaSedeAdminId, setNuevaSedeAdminId, nuevaSedeNumeroSalas, setNuevaSedeNumeroSalas, nuevaSedeVip, setNuevaSedeVip, crearSede,
    expandedSede, setExpandedSede,
    userToEdit, setUserToEdit, guardarEdicionUsuario,
    userToSuspend, setUserToSuspend, suspenderUsuario,
    userToDelete, setUserToDelete, eliminarUsuario,
    successMessage, setSuccessMessage,
    notification, setNotification,
    isLoading
}: ModalsManagerProps) {
    return (
        <>
            {/* Crear Usuario(Administrador) */}
            {showModalAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Crear Nuevo Administrador</h2>
                        <div className="space-y-4 relative z-10 max-h-[70vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Nombres</label>
                                    <input type="text" placeholder="Ej: Juan" value={nombres} onChange={(e) => setNombres(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Apellidos</label>
                                    <input type="text" placeholder="Ej: Pérez" value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Cédula</label>
                                    <input type="text" placeholder="Ej: 1000000000" value={cedula} onChange={(e) => setCedula(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Teléfono</label>
                                    <input type="tel" placeholder="Ej: 3000000000" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Correo Electrónico</label>
                                <input type="email" placeholder="admin@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Contraseña</label>
                                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Departamento</label>
                                    <div className="relative">
                                        <select value={departamento} onChange={(e) => { setDepartamento(e.target.value); setCiudad(""); setNombreSede(""); }} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer" required>
                                            <option value="">Seleccione...</option>
                                            {departamentos.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Ciudad</label>
                                    <div className="relative">
                                        <select value={ciudad} onChange={(e) => { setCiudad(e.target.value); setNombreSede(""); }} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer" required disabled={!departamento}>
                                            <option value="">Seleccione...</option>
                                            {ciudadesDisponibles.map((city) => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100"><strong className="text-blue-700">Nota:</strong> La contraseña se guardará de forma segura y encriptada.</div>
                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                                <button onClick={() => setShowModalAdmin(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                                <button onClick={crearAdministrador} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Crear Administrador</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CREAR NUEVA SEDE */}
            {showModalSede && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModalSede(false)}></div>
                    <div className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Crear Nueva Sede</h2>
                        <div className="space-y-4 relative z-10 max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Nombre de la Sede</label>
                                <input type="text" placeholder="Ej: Sede Principal Norte" value={nuevaSedeNombre} onChange={(e) => setNuevaSedeNombre(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Departamento</label>
                                    <div className="relative">
                                        <select value={nuevaSedeDepartamento} onChange={(e) => { setNuevaSedeDepartamento(e.target.value); setNuevaSedeCiudad(""); }} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer" required>
                                            <option value="">Seleccione...</option>
                                            {departamentos.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Ciudad</label>
                                    <div className="relative">
                                        <select value={nuevaSedeCiudad} onChange={(e) => setNuevaSedeCiudad(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer" required disabled={!nuevaSedeDepartamento}>
                                            <option value="">Seleccione...</option>
                                            {(nuevaSedeDepartamento ? (ubicaciones[nuevaSedeDepartamento as keyof typeof ubicaciones] || []) : []).map((city) => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Encargado / Administrador <span className="text-slate-400 font-normal lowercase">(Opcional)</span></label>
                                <div className="relative">
                                    <select value={nuevaSedeAdminId} onChange={(e) => setNuevaSedeAdminId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer">
                                        <option value="">Sin asignar por ahora...</option>
                                        {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombres ? `${u.nombres} ${u.apellidos} - ${u.email}` : u.email}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Número de Salas</label>
                                    <input type="number" min="1" max="10" value={nuevaSedeNumeroSalas} onChange={(e) => setNuevaSedeNumeroSalas(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">¿Incluye Sala VIP?</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={nuevaSedeVip} onChange={(e) => setNuevaSedeVip(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                        <span className="ml-3 text-sm font-bold text-slate-600">Sí, habilitar VIP</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                                <button onClick={() => setShowModalSede(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                                <button onClick={crearSede} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Crear Sede</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE PANTALLA EXPANDIDA */}
            {expandedSede && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md cursor-pointer transition-opacity" onClick={() => setExpandedSede(null)}></div>
                    
                    <div className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col gap-4 transform transition-transform animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center px-2 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    📺 Monitoreo en Vivo: {expandedSede.nombre}
                                    <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-red-200 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                        En Directo
                                    </span>
                                </h3>
                            </div>
                            <button onClick={() => setExpandedSede(null)} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg shadow-sm transition-colors border border-slate-200">✕</button>
                        </div>
                        
                        <div className="w-full aspect-video rounded-xl overflow-hidden border-4 border-slate-900 shadow-2xl bg-black relative">
                            <PantallaEscalada />
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDITAR USUARIO */}
            {userToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setUserToEdit(null)}></div>
                    <div className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Editar Usuario</h2>
                        <div className="space-y-4 relative z-10 max-h-[70vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Nombres</label>
                                    <input type="text" value={userToEdit.nombres || ""} onChange={(e) => setUserToEdit({...userToEdit, nombres: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Apellidos</label>
                                    <input type="text" value={userToEdit.apellidos || ""} onChange={(e) => setUserToEdit({...userToEdit, apellidos: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Cédula</label>
                                    <input type="text" value={userToEdit.cedula || ""} onChange={(e) => setUserToEdit({...userToEdit, cedula: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Teléfono</label>
                                    <input type="tel" value={userToEdit.telefono || ""} onChange={(e) => setUserToEdit({...userToEdit, telefono: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Correo Electrónico</label>
                                <input type="email" value={userToEdit.email || ""} onChange={(e) => setUserToEdit({...userToEdit, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Contraseña <span className="text-slate-400 font-normal lowercase">(Dejar en blanco para no cambiar)</span></label>
                                <input type="password" placeholder="••••••••" value={userToEdit.password || ""} onChange={(e) => setUserToEdit({...userToEdit, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Departamento</label>
                                    <div className="relative">
                                        <select value={userToEdit.departamento || ""} onChange={(e) => setUserToEdit({...userToEdit, departamento: e.target.value, ciudad: "", nombreSede: ""})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer" required>
                                            <option value="">Seleccione...</option>
                                            {departamentos.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Ciudad</label>
                                    <div className="relative">
                                        <select value={userToEdit.ciudad || ""} onChange={(e) => setUserToEdit({...userToEdit, ciudad: e.target.value, nombreSede: ""})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer" required disabled={!userToEdit.departamento}>
                                            <option value="">Seleccione...</option>
                                            {(userToEdit.departamento ? (ubicaciones[userToEdit.departamento as keyof typeof ubicaciones] || []) : []).map((city) => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Sede</label>
                                    <div className="relative">
                                        <select value={userToEdit.nombreSede || ""} onChange={(e) => setUserToEdit({...userToEdit, nombreSede: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer" required disabled={!userToEdit.ciudad}>
                                            <option value="">Seleccione Sede...</option>
                                            {userToEdit.ciudad && sedes.filter(s => s.ciudad === userToEdit.ciudad).map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Estado de la Cuenta</label>
                                    <div className="relative">
                                        <select value={userToEdit.estado || "ACTIVA"} onChange={(e) => setUserToEdit({...userToEdit, estado: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium shadow-sm appearance-none cursor-pointer">
                                            <option value="ACTIVA">Activa</option>
                                            <option value="INACTIVA">Inactiva / Suspendida</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                                <button onClick={() => setUserToEdit(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                                <button onClick={guardarEdicionUsuario} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN DE SUSPENSIÓN */}
            {userToSuspend && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setUserToSuspend(null)}></div>
                    <div className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 text-center mb-2">Suspender Usuario</h2>
                        <p className="text-sm text-slate-500 text-center mb-8">El usuario no podrá acceder al sistema temporalmente. Podrás reactivarlo en cualquier momento.</p>
                        
                        <div className="flex gap-3 relative z-10">
                            <button onClick={() => setUserToSuspend(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                            <button onClick={suspenderUsuario} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Sí, Suspender</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {userToDelete && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setUserToDelete(null)}></div>
                    <div className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 text-center mb-2">¿Estás seguro?</h2>
                        <p className="text-sm text-slate-500 text-center mb-8">Esta acción eliminará permanentemente a este usuario y todos sus datos asociados. No podrás deshacer esta acción.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setUserToDelete(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                            <button onClick={eliminarUsuario} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Sí, Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE ÉXITO (Diseño similar a confirmación) */}
            {successMessage && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSuccessMessage(null)}></div>
                    <div className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 text-center mb-2">¡Operación Exitosa!</h2>
                        <p className="text-sm text-slate-500 text-center mb-8">{successMessage}</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setSuccessMessage(null)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Continuar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION (Diseño Moderno) */}
            {notification.show && (
                <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-8 fade-in duration-300">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border ${
                        notification.type === 'success' 
                        ? 'bg-white border-green-100' 
                        : 'bg-white border-red-100'
                    }`}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                            {notification.type === 'success' ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {notification.type === 'success' ? '¡Operación Exitosa!' : 'Atención'}
                            </h4>
                            <p className="text-xs text-slate-600 font-medium mt-0.5">{notification.message}</p>
                        </div>
                        <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 text-slate-400 hover:text-slate-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* LOADER GLOBAL (SPINNER) */}
            {isLoading && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="flex flex-col items-center gap-4 bg-white px-8 py-6 rounded-3xl shadow-2xl border border-slate-100">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin shadow-sm"></div>
                        <p className="text-sm font-black text-slate-700 tracking-wide uppercase">Cargando...</p>
                    </div>
                </div>
            )}
        </>
    );
}