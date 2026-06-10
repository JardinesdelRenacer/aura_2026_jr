"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Componente para forzar la resolución Full HD (1920x1080) y escalarla a cualquier tamaño
const PantallaEscalada = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setScale(entry.contentRect.width / 1920);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-slate-900">
            <div className="absolute top-0 left-0 origin-top-left" style={{ width: '1920px', height: '1080px', transform: `scale(${scale})` }}>
                <iframe src="/Pantalla" className="w-full h-full border-0 pointer-events-none" tabIndex={-1} />
            </div>
        </div>
    );
};

export default function MasterDashboard() {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("monitoreo");
    const [expandedSede, setExpandedSede] = useState<any>(null);

    // se agrega constantes para crear el administrador
    const [showModalAdmin, setShowModalAdmin] = useState(false);
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [nombreSede, setNombreSede] = useState("");

    const router = useRouter();

    const handleLogout = () => {
        router.push("/login");
    };

    // Datos simulados para el mockup
    const mockSedes = [
        { id: 1, nombre: "Sede Centro", admin: "centro@jardinesdelrenacer.co", estado: "Transmitiendo", obituarios: 45, tendencia: "+12%" },
        { id: 2, nombre: "Sede Norte", admin: "norte@jardinesdelrenacer.co", estado: "Transmitiendo", obituarios: 38, tendencia: "+5%" },
        { id: 3, nombre: "Sede Sur (VIP)", admin: "sur@jardinesdelrenacer.co", estado: "Inactiva", obituarios: 12, tendencia: "-2%" },
    ];

    const crearAdministrador = async () => {
        try {
            const response = await fetch("/api/master/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    departamento,
                    ciudad,
                    nombreSede,
                }),
            });
            const data = await response.json();

            if (data.success) {
                alert("Administrador creado exitosamente");
                setShowModalAdmin(false);
                // Aquí podrías agregar lógica para actualizar la lista de usuarios sin recargar la página
            } else {
                alert("Error al crear administrador: " + data.error);
            }
        } catch (error) {
            console.error("Error creating administrator:", error);
        }
    };

    const cargarUsuarios = async () => {
        try {
            const response = await fetch("/api/master/users");
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-blue-50 font-sans">
            
            {/* HEADER MASTER */}
            <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-white/40 backdrop-blur-lg border border-white/60 shadow-xl rounded-2xl gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-950 rounded-full flex items-center justify-center border border-white/60 shadow-sm p-1.5">
                        <img src="/imagenes/logo-oficial.webp" alt="JR Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-wider text-slate-800">Aura Master <span className="text-blue-600">Control</span></h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Centro de Operaciones</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-600 bg-white/50 px-4 py-2 rounded-full border border-white/60 shadow-inner">Sistemas en línea</span>
                    <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                        <span className="font-bold text-blue-700">MS</span>
                    </div>
                    <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-200 hover:border-red-300 font-bold px-4 py-2 rounded-full transition-all text-xs uppercase tracking-widest">
                        Salir
                    </button>
                </div>
            </header>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* SIDEBAR DE NAVEGACIÓN */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg rounded-3xl p-4 flex flex-col gap-2">
                        <button 
                            onClick={() => setActiveTab("monitoreo")}
                            className={`p-4 rounded-2xl text-left font-bold transition-all shadow-sm ${activeTab === "monitoreo" ? "bg-blue-600 text-white shadow-blue-500/30 transform -translate-y-1" : "bg-white/50 text-slate-600 hover:bg-white/80"}`}
                        >
                            Monitoreo en Vivo
                        </button>
                        <button 
                            onClick={() => setActiveTab("analiticas")}
                            className={`p-4 rounded-2xl text-left font-bold transition-all shadow-sm ${activeTab === "analiticas" ? "bg-blue-600 text-white shadow-blue-500/30 transform -translate-y-1" : "bg-white/50 text-slate-600 hover:bg-white/80"}`}
                        >
                            Métricas y Analíticas
                        </button>
                        <button 
                            onClick={() => setActiveTab("usuarios")}
                            className={`p-4 rounded-2xl text-left font-bold transition-all shadow-sm ${activeTab === "usuarios" ? "bg-blue-600 text-white shadow-blue-500/30 transform -translate-y-1" : "bg-white/50 text-slate-600 hover:bg-white/80"}`}
                        >
                            Gestión de Usuarios
                        </button>
                        <button 
                            onClick={() => setActiveTab("sedes")}
                            className={`p-4 rounded-2xl text-left font-bold transition-all shadow-sm ${activeTab === "sedes" ? "bg-blue-600 text-white shadow-blue-500/30 transform -translate-y-1" : "bg-white/50 text-slate-600 hover:bg-white/80"}`}
                        >
                            Administración de Sedes
                        </button>
                    </div>
                    
                    <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h3 className="font-black text-xl mb-2 relative z-10">Resumen Rápido</h3>
                        <p className="text-blue-200 text-sm relative z-10">Total Obituarios Hoy: <strong className="text-white text-lg">14</strong></p>
                        <p className="text-blue-200 text-sm relative z-10">Sedes Activas: <strong className="text-white text-lg">2/3</strong></p>
                    </div>
                </div>

                {/* ÁREA PRINCIPAL */}
                <div className="lg:col-span-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8">
                    
                    {/* VISTA MONITOREO */}
                    {activeTab === "monitoreo" && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-200/60 pb-4">Pantallas en Tiempo Real</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mockSedes.map((sede) => (
                                    <div key={sede.id} className="bg-white/60 border border-white/80 rounded-2xl p-4 shadow-md flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-lg text-slate-800">{sede.nombre}</h3>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${sede.estado === "Transmitiendo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {sede.estado}
                                            </span>
                                        </div>
                                        {/* Pantalla Miniatura en Vivo */}
                                        <div 
                                            className={`w-full aspect-video bg-slate-900 rounded-xl overflow-hidden relative border-4 border-slate-900 shadow-inner ${sede.estado === "Transmitiendo" ? "cursor-pointer hover:border-blue-500 transition-colors group/screen" : "flex items-center justify-center"}`}
                                            onClick={() => { if(sede.estado === "Transmitiendo") setExpandedSede(sede); }}
                                        >
                                            {sede.estado === "Transmitiendo" ? (
                                                <>
                                                    <PantallaEscalada />
                                                    <div className="absolute inset-0 z-10 bg-transparent group-hover/screen:bg-blue-500/10 transition-colors" title="Clic para ampliar pantalla" />
                                                    <div className="absolute top-3 right-3 bg-red-500 animate-pulse w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] z-20" title="En Directo"></div>
                                                </>
                                            ) : (
                                                <p className="text-xs text-red-400 font-bold uppercase tracking-widest">Pantalla Apagada</p>
                                            )}
                                        </div>
                                        <button className="mt-4 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold py-2 rounded-xl text-sm transition-colors border border-slate-200">
                                            Configurar Sede
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VISTA ANALÍTICAS */}
                    {activeTab === "analiticas" && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-200/60 pb-4">Rendimiento y Analíticas</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-white/80 p-6 rounded-2xl border border-white shadow-md">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sede Top Mes</p>
                                    <h3 className="text-2xl font-black text-blue-600">Sede Centro</h3>
                                    <p className="text-sm font-bold text-emerald-500 mt-2">↑ Mayor volumen</p>
                                </div>
                                <div className="bg-white/80 p-6 rounded-2xl border border-white shadow-md">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Obituarios</p>
                                    <h3 className="text-2xl font-black text-slate-800">452</h3>
                                    <p className="text-sm font-bold text-emerald-500 mt-2">+12% vs mes pasado</p>
                                </div>
                                <div className="bg-white/80 p-6 rounded-2xl border border-white shadow-md">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Carga del Servidor</p>
                                    <h3 className="text-2xl font-black text-slate-800">18%</h3>
                                    <p className="text-sm font-bold text-emerald-500 mt-2">Óptimo</p>
                                </div>
                            </div>
                            
                            <div className="w-full h-64 bg-white/60 border border-white shadow-inner rounded-2xl flex items-center justify-center flex-col">
                                <p className="text-slate-400 font-bold mb-2">Aquí instalaremos la gráfica (Recharts)</p>
                                <div className="flex items-end gap-2 h-32">
                                    <div className="w-8 bg-blue-200 rounded-t-sm h-12"></div>
                                    <div className="w-8 bg-blue-300 rounded-t-sm h-20"></div>
                                    <div className="w-8 bg-blue-400 rounded-t-sm h-16"></div>
                                    <div className="w-8 bg-blue-500 rounded-t-sm h-28"></div>
                                    <div className="w-8 bg-blue-600 rounded-t-sm h-24"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VISTA USUARIOS */}
                    {activeTab === "usuarios" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b-2 border-slate-200/60 pb-4">
                                <h2 className="text-2xl font-black text-slate-800">Gestión de Cuentas (Admins)</h2>
                                <button onClick={() => setShowModalAdmin(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-lg transition-colors text-sm">
                                    + Nuevo Administrador
                                </button>
                            </div>
                            <div className="overflow-x-auto bg-white/60 rounded-2xl shadow-inner border border-white p-4">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs uppercase tracking-widest text-slate-400 border-b border-slate-200">
                                            <th className="pb-3 pl-2">Usuario / Correo</th>
                                            <th className="pb-3">Sede Asignada</th>
                                            <th className="pb-3">Estado</th>
                                            <th className="pb-3 text-right pr-2">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map((u, i) => (
                                            <tr key={u.id} className="border-b border-slate-100 hover:bg-white/50 transition-colors">
                                                <td className="py-4 pl-2 font-bold text-slate-700">{u.email}</td>
                                                <td className="py-4 text-sm font-medium text-slate-500">{u.sede?.nombre || "Sin sede asignada"}</td>
                                                <td className="py-4"><span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${u.sede?.estado === "ACTIVA" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.sede?.estado || "INACTIVA"}</span></td>
                                                <td className="py-4 text-right pr-2">
                                                    <button className="text-blue-500 hover:text-blue-700 text-sm font-bold mr-3">Editar</button>
                                                    <button className="text-red-500 hover:text-red-700 text-sm font-bold">Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            { showModalAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded 3xl p-8 w-full max-w-lg shadow-2xl relative">
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Crear Nuevo Administrador</h2>
                        <div className="space-y-4">
                            <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            <input type="text" placeholder="Departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            <input type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            <input type="text" placeholder="Nombre de la Sede" value={nombreSede} onChange={(e) => setNombreSede(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            <div className="text-sm text-slate-500">La contraseña se guardará de forma segura y encriptada.</div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowModalAdmin(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-4 py-2 rounded-xl transition-colors w-full">Cancelar</button>

                                <button onClick={crearAdministrador} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-colors w-full">Crear Administrador</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE PANTALLA EXPANDIDA */}
            {expandedSede && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm cursor-pointer transition-opacity" onClick={() => setExpandedSede(null)}></div>
                    
                    <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 p-4 sm:p-6 rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col gap-4 transform transition-transform">
                        <div className="flex justify-between items-center px-2">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-3">
                                    📺 Monitoreo en Vivo: {expandedSede.nombre}
                                    <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full animate-pulse border border-red-200">En Directo</span>
                                </h3>
                                <p className="text-slate-600 text-xs font-bold mt-1">{expandedSede.admin}</p>
                            </div>
                            <button onClick={() => setExpandedSede(null)} className="w-10 h-10 bg-white/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center font-bold text-xl shadow-sm transition-colors border border-slate-200">✕</button>
                        </div>
                        
                        <div className="w-full aspect-video rounded-2xl overflow-hidden border-8 border-slate-900 shadow-2xl bg-black relative">
                            <PantallaEscalada />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
