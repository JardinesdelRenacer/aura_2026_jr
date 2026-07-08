import React from "react";

interface UsuariosTabProps {
    usuarios: any[];
    setShowModalAdmin: (show: boolean) => void;
    setUserToEdit: (user: any) => void;
    setUserToSuspend: (userId: string) => void;
    setUserToDelete: (userId: string) => void;
}

export function UsuariosTab({
    usuarios,
    setShowModalAdmin,
    setUserToEdit,
    setUserToSuspend,
    setUserToDelete
}: UsuariosTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Usuarios y Accesos</h3>
                    <p className="text-sm text-slate-500 mt-1">Administra las credenciales, sedes y roles del sistema.</p>
                </div>
                <button onClick={() => setShowModalAdmin(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
                    <div className="relative flex-1">
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input type="text" placeholder="Buscar por nombre o correo..." className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner" />
                    </div>
                    <select className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-600 shadow-inner">
                        <option>Todos los roles</option>
                        <option>Admin Sede</option>
                        <option>Super Master</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-bold">Usuario / Correo</th>
                                <th className="p-4 font-bold">Sede Asignada</th>
                                <th className="p-4 font-bold">Rol</th>
                                <th className="p-4 font-bold">Estado</th>
                                <th className="p-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {usuarios.map((u, i) => {
                                const ultimaConexion = u.lastSeen ? new Date(u.lastSeen) : undefined;
                                
                                const activo = ultimaConexion && Date.now() - ultimaConexion.getTime() < 15000;

                                return(
                                    <tr key={u.id || i} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shadow-inner border border-blue-200">
                                                    {u.email ? u.email.charAt(0).toUpperCase() : "?"}
                                                </div>
                                                <div className="flex flex-col">
                                                <span className="font-bold text-slate-700">{u.email}</span>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        Último acceso: {" "}
                                                        {ultimaConexion ? ultimaConexion.toLocaleString("es-CO") : "Nunca"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-slate-600 font-semibold">{u.sede?.nombre || "Sin sede asignada"}</td>

                                        <td className="p-4">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold tracking-widest border border-slate-200">ADMIN SEDE</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${u.estado === "SUSPENDIDO" ? "bg-amber-50 text-amber-600 border-amber-200" : activo ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}> 
                                                {u.estado === "SUSPENDIDO" ? "SUSPENDIDO" : activo ? "ACTIVO" : "INACTIVO"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setUserToEdit({
                                                    id: u.id,
                                                    nombres: u.nombres || "",
                                                    apellidos: u.apellidos || "",
                                                    cedula: u.cedula || "",
                                                    telefono: u.telefono || "",
                                                    email: u.email,
                                                    password: "",
                                                    estado: u.estado ?? "ACTIVO", 
                                                    departamento: u.departamento || u.sede?.departamento || "",
                                                    ciudad: u.ciudad || u.sede?.ciudad || "",
                                                    nombreSede: u.sede?.nombre || ""
                                                })} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all shadow-sm border border-emerald-100" title="Editar Credenciales">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (u.estado === "SUSPENDIDO") {
                                                            return;
                                                        }
                                                        setUserToSuspend(u.id);
                                                    }}
                                                    disabled={u.estado === "SUSPENDIDO"}
                                                    title={
                                                        u.estado === "SUSPENDIDO" ? "Usuario suspendido" : "Suspender usuairo"
                                                    }
                                                    className={`p-2 text-amber-500 bg-amber-50 hover:bg-amber-100 hover:text-amber-600 rounded-lg transition-all shadow-sm border border-amber-100" ${
                                                        u.estado === "SUSPENDIDO" ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60" : "text-amber-500 bg-amber-50 hover:bg-amber-100 hover:text-amber-600 border-amber-100"
                                                    }`}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </button>
                                                <button onClick={() => setUserToDelete(u.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all shadow-sm border border-red-100" title="Eliminar Usuario">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>  
                                    </tr>
                                );   
                            })}   
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}