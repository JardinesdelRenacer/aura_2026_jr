"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Se importan ubicaciones para el formulario de creación de sedes
import { ubicaciones } from "@/src/data/ubicaciones";

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
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [usuarios, setUsuarios] = useState<any[]>([]);
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

    // Menú de navegación Enterprise
    const menuItems = useMemo(() => [
        { id: "dashboard", label: "Dashboard Master", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { id: "salas", label: "Gestión de Salas", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
        { id: "usuarios", label: "Usuarios y Accesos", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        { id: "reportes", label: "Reportes y Analíticas", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { id: "traslados", label: "Traslados y Control", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
        { id: "configuracion", label: "Configuración", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
    ], []);
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
                cargarUsuarios(); // Recargar usuarios
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

    const departamentos = Object.keys(ubicaciones);

    const ciudadesDisponibles = departamento ? ubicaciones[departamento as keyof typeof ubicaciones] : [];

    // Eliminar Usuario
    const eliminarUsuario = async (userId: string) => {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.");
        if (!confirmDelete) {
            return;
        }

        const response = await fetch(`/api/master/users/${userId}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
            alert("Usuario eliminado exitosamente");
            cargarUsuarios(); // Recargar usuarios después de eliminar
        } else {
            alert("Error al eliminar usuario: " + data.error);
        }
    };

    const editarUsuario = (userId: string) => {
        const newEmail = prompt("Ingrese el nuevo correo electrónico para este usuario:");
        if (newEmail) {
            // Aquí podrías agregar la lógica para actualizar el correo del usuario en la base de datos
            alert("Correo actualizado a: " + newEmail);
            cargarUsuarios(); // Recargar usuarios después de editar
        } else {
            alert("No se ingresó un correo válido. La actualización ha sido cancelada.");
        }
    };

    return (
        <div className="flex h-screen bg-[#EEF4FF] overflow-hidden font-sans text-slate-800">
            
            {/* SIDEBAR ENTERPRISE */}
            <aside className="w-72 bg-white border-r border-gray-200 flex-col hidden lg:flex shadow-xs z-20">
                <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
                    <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center p-1.5 shadow-sm">
                        <img src="/imagenes/logo-oficial.webp" alt="JR Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-wide text-slate-900 leading-tight">Aura Master</h1>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Centro Operativo</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Menú Principal</p>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === item.id ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                SM
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-slate-800 leading-tight">Super Master</span>
                                <span className="text-[10px] font-semibold text-slate-500">master@aura2026.co</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors border border-red-100">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* TOPBAR */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-xs z-10">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wide">Sistemas en línea</span>
                        </div>
                    </div>
                </header>

                {/* CONTENIDO DINÁMICO */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 bg-[#EEF4FF]">
                    <div className="max-w-7xl mx-auto w-full">

                        {/* MÓDULO 1: DASHBOARD MASTER */}
                        {activeTab === "dashboard" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                
                                {/* Tarjetas de Resumen (KPIs) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+2 activas</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">14</h3>
                                        <p className="text-sm font-semibold text-slate-500 mt-1">Sedes transmitiendo hoy</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">General</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">452</h3>
                                        <p className="text-sm font-semibold text-slate-500 mt-1">Obituarios procesados este mes</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Óptimo</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">18%</h3>
                                        <p className="text-sm font-semibold text-slate-500 mt-1">Carga promedio de servidores</p>
                                    </div>
                                </div>

                                {/* Monitoreo Visual en Vivo */}
                                <h3 className="text-lg font-bold text-slate-800 mb-2 mt-8">Monitoreo de Pantallas en Tiempo Real</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mockSedes.map((sede) => (
                                        <div key={sede.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{sede.nombre}</h3>
                                                    <p className="text-xs text-slate-500 font-medium">{sede.admin}</p>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${sede.estado === "Transmitiendo" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                                                    {sede.estado}
                                                </span>
                                            </div>
                                            <div 
                                                className={`w-full aspect-video bg-slate-900 rounded-lg overflow-hidden relative border border-slate-800 shadow-inner ${sede.estado === "Transmitiendo" ? "cursor-pointer group-hover:ring-4 ring-blue-500/20 transition-all group/screen" : "flex items-center justify-center"}`}
                                                onClick={() => { if(sede.estado === "Transmitiendo") setExpandedSede(sede); }}
                                            >
                                                {sede.estado === "Transmitiendo" ? (
                                                    <>
                                                        <PantallaEscalada />
                                                        <div className="absolute inset-0 z-10 bg-black/0 group-hover/screen:bg-black/10 transition-colors flex items-center justify-center">
                                                            <span className="bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover/screen:opacity-100 transition-opacity backdrop-blur-sm">Ampliar Monitor</span>
                                                        </div>
                                                        <div className="absolute top-2 right-2 bg-red-500 animate-pulse w-2 h-2 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] z-20" title="En Directo"></div>
                                                    </>
                                                ) : (
                                                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Pantalla Offline</p>
                                                )}
                                            </div>
                                            <button className="mt-4 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold py-2 rounded-lg text-xs transition-colors border border-slate-200 shadow-sm w-full">
                                                Ver Detalles
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* MÓDULO 2: GESTIÓN DE SALAS */}
                        {activeTab === "salas" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800">Listado de Sedes y Salas</h3>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Crear Nueva Sede
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mockSedes.map((sede) => (
                                        <div key={sede.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col group transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-lg">{sede.nombre}</h4>
                                                    <p className="text-xs text-slate-500 font-semibold">{sede.admin}</p>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${sede.estado === "Transmitiendo" ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                                                    {sede.estado}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-5">
                                                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Obituarios</p>
                                                    <p className="text-2xl font-black text-slate-700">{sede.obituarios}</p>
                                                </div>
                                                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tendencia</p>
                                                    <p className={`text-2xl font-black ${sede.tendencia.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{sede.tendencia}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-auto flex flex-col gap-2">
                                                <button 
                                                    onClick={() => router.push('/proyectar')}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                                                >
                                                    Administrar Sala
                                                </button>
                                                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg text-sm transition-colors border border-slate-200">
                                                    Configuración
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* MÓDULO 3: GESTIÓN DE USUARIOS */}
                        {activeTab === "usuarios" && (
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
                                            {usuarios.map((u, i) => (
                                                <tr key={u.id || i} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors group">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shadow-inner border border-blue-200">
                                                                {u.email ? u.email.charAt(0).toUpperCase() : "?"}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                <span className="font-bold text-slate-700">{u.email}</span>
                                                                    <span className="text-xs text-slate-400 font-medium">Último acceso: Hace 2 horas</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    <td className="p-4 text-slate-600 font-semibold">{u.sede?.nombre || "Sin sede asignada"}</td>
                                                        <td className="p-4">
                                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold tracking-widest border border-slate-200">ADMIN SEDE</span>
                                                        </td>
                                                        <td className="p-4">
                                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${u.sede?.estado === "ACTIVA" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>{u.sede?.estado || "INACTIVA"}</span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => editarUsuario(u.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar Credenciales">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                </button>
                                                                <button onClick={() => eliminarUsuario (u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Suspender Usuario">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MÓDULO 4: REPORTES Y ANALÍTICAS */}
                        {activeTab === "reportes" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Reportes y Analíticas</h3>
                                        <p className="text-sm text-slate-500 mt-1">Métricas de rendimiento y uso del sistema en todas las sedes.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-sm flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                            Filtrar
                                        </button>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Exportar Informe
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Obituarios</p>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+15%</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">1,248</h3>
                                        <p className="text-xs font-semibold text-slate-500 mt-2">Últimos 30 días</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Horas Transmisión</p>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+5%</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">342h</h3>
                                        <p className="text-xs font-semibold text-slate-500 mt-2">Acumulado mensual</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sede Más Activa</p>
                                        </div>
                                        <h3 className="text-xl font-black text-blue-700 truncate">Sede Centro</h3>
                                        <p className="text-xs font-semibold text-slate-500 mt-2">450 obituarios (36%)</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uso de Pantallas</p>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Óptimo</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800">85%</h3>
                                        <p className="text-xs font-semibold text-slate-500 mt-2">Ocupación promedio</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Gráfico Placeholder */}
                                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-slate-800">Tendencia de Publicaciones</h4>
                                            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-blue-400">
                                                <option>Últimos 6 meses</option>
                                                <option>Este año</option>
                                            </select>
                                        </div>
                                        <div className="flex-1 w-full h-64 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-col relative overflow-hidden">
                                            {/* Simulación de gráfico de barras */}
                                            <div className="flex items-end gap-4 h-40 w-full px-8 justify-between z-0">
                                                {[40, 70, 45, 90, 65, 85].map((h, i) => (
                                                    <div key={i} className="w-full max-w-[40px] bg-blue-100 rounded-t-md relative group">
                                                        <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-600" style={{ height: `${h}%` }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex w-full px-8 justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest z-0">
                                                <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                                <span className="bg-white/90 backdrop-blur-sm text-slate-500 font-bold px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm">Área reservada para Gráfica Real (Recharts)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lista de Rendimiento */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                                        <h4 className="font-bold text-slate-800 mb-6">Rendimiento por Sede</h4>
                                        <div className="flex flex-col gap-4">
                                            {mockSedes.map((sede, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-700 text-sm">{sede.nombre}</span>
                                                        <span className="text-[10px] font-semibold text-slate-400">{sede.obituarios} obituarios</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-bold ${sede.tendencia.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{sede.tendencia}</span>
                                                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                            <div className={`h-full ${sede.tendencia.startsWith('+') ? 'bg-emerald-500' : 'bg-red-400'}`} style={{ width: `${Math.max(30, sede.obituarios)}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="mt-auto pt-4 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors w-full text-center">Ver reporte completo →</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MÓDULO 5: TRASLADOS Y CONTROL */}
                        {activeTab === "traslados" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Traslados y Control Operativo</h3>
                                        <p className="text-sm text-slate-500 mt-1">Gestione el movimiento de obituarios entre diferentes salas y sedes en tiempo real.</p>
                                    </div>
                                </div>

                                {/* Panel Principal de Traslado */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                        <h4 className="font-bold text-slate-800">Asistente de Traslado</h4>
                                        <p className="text-xs text-slate-500 mt-1">Seleccione la sala de origen y el destino para migrar los datos de la pantalla de forma automática.</p>
                                    </div>
                                    
                                    <div className="p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/30">
                                        {/* ORIGEN */}
                                        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
                                            <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-black tracking-widest text-slate-400 uppercase">Origen</div>
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">Seleccionar Sala Actual</label>
                                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700 font-medium">
                                                <option>Sede Centro - Sala VIP</option>
                                                <option>Sede Norte - Sala 1</option>
                                                <option>Sede Sur - Sala 2</option>
                                            </select>
                                            <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 transition-all">
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Obituario Activo</p>
                                                <p className="text-sm font-bold text-slate-700">Juan Carlos Pérez Gómez</p>
                                                <p className="text-xs text-slate-500 mt-1">Transmitiendo desde: 08:00 AM</p>
                                            </div>
                                        </div>

                                        {/* ICONO CENTRAL */}
                                        <div className="hidden md:flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-md border border-slate-200 relative z-10">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                            </div>
                                        </div>

                                        {/* DESTINO */}
                                        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
                                            <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-black tracking-widest text-slate-400 uppercase">Destino</div>
                                            <label className="block text-sm font-semibold mb-2 text-slate-700">Seleccionar Nueva Sala</label>
                                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700 font-medium">
                                                <option>Seleccione un destino...</option>
                                                <option>Sede Centro - Sala 2</option>
                                                <option>Sede Norte - Sala VIP</option>
                                            </select>
                                            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <p className="text-sm font-bold text-slate-600">Sala Disponible para Traslado</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                        <button className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors">Cancelar</button>
                                        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                            Ejecutar Traslado
                                        </button>
                                    </div>
                                </div>

                                {/* Historial de Traslados */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h4 className="font-bold text-slate-800">Historial de Movimientos</h4>
                                        <button className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors">Ver historial completo</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                                                    <th className="p-4 font-bold">Fecha y Hora</th>
                                                    <th className="p-4 font-bold">Obituario</th>
                                                    <th className="p-4 font-bold">Origen</th>
                                                    <th className="p-4 font-bold">Destino</th>
                                                    <th className="p-4 font-bold">Usuario</th>
                                                    <th className="p-4 font-bold">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-slate-600">
                                                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4 whitespace-nowrap">Hoy, 10:45 AM</td>
                                                    <td className="p-4 font-bold text-slate-700">María López</td>
                                                    <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium border border-slate-200 shadow-sm">Sede Sur - Sala 1</span></td>
                                                    <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium border border-slate-200 shadow-sm">Sede Sur - Sala VIP</span></td>
                                                    <td className="p-4 text-xs font-medium">admin@aura2026.co</td>
                                                    <td className="p-4"><span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-md text-[10px] font-black uppercase tracking-wider">Completado</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MÓDULO 6: CONFIGURACIÓN MASTER */}
                        {activeTab === "configuracion" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Configuración del Sistema</h3>
                                        <p className="text-sm text-slate-500 mt-1">Administre los parámetros globales, apariencia y preferencias operativas de Aura.</p>
                                    </div>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Guardar Cambios
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Branding y Apariencia */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                                Apariencia y Marca
                                            </h4>
                                        </div>
                                        <div className="p-6 space-y-5">
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-slate-700">Nombre de la Organización</label>
                                                <input type="text" defaultValue="Jardines del Renacer" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Color Primario</label>
                                                    <div className="flex items-center gap-3">
                                                        <input type="color" defaultValue="#2563EB" className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                                                        <span className="text-sm text-slate-600 font-medium">#2563EB</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Logotipo Oficial</label>
                                                    <button className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">Actualizar Logo</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parámetros de Transmisión */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Parámetros de Pantallas
                                            </h4>
                                        </div>
                                        <div className="p-6 space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Tiempo Base (Fotos)</label>
                                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700">
                                                        <option>10 Segundos</option>
                                                        <option>15 Segundos</option>
                                                        <option>30 Segundos</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Transición Global</label>
                                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700">
                                                        <option>Difuminado (Fade)</option>
                                                        <option>Deslizamiento (Slide)</option>
                                                        <option>Zoom Suave</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-slate-700 flex justify-between">Intervalo de Refresco <span>10s</span></label>
                                                <input type="range" min="5" max="60" defaultValue="10" className="w-full accent-blue-600" />
                                                <p className="text-[10px] text-slate-400 mt-1">Tiempo que tardan las pantallas en leer la base de datos.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preferencias del Sistema Avanzadas */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
                                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Opciones Avanzadas
                                            </h4>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                {[
                                                    { title: "Alertas por Desconexión", desc: "Enviar email si una sede se apaga." },
                                                    { title: "Modo Estricto", desc: "Requerir 2FA para administradores." },
                                                    { title: "Auto-limpieza de Caché", desc: "Limpiar multimedia cada 24h." }
                                                ].map((opt, i) => (
                                                    <label key={i} className="flex items-start gap-3 cursor-pointer group">
                                                        <div className="relative flex items-center justify-center mt-0.5">
                                                            <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                                                            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </div>
                                                        <div>
                                                            <span className="block text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{opt.title}</span>
                                                            <span className="block text-xs text-slate-500 mt-0.5">{opt.desc}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </main>
            </div>
            
            // Crear Usuario(Administrador)
            { showModalAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded 3xl p-8 w-full max-w-lg shadow-2xl relative">
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Crear Nuevo Administrador</h2>
                        <div className="space-y-4">
                            <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            <select value={departamento} onChange={(e) => setDepartamento(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                <option value="">Seleccionar Departamento</option>
                                {departamentos.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                            <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                <option value="">Seleccionar Ciudad</option>
                                {ciudadesDisponibles.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
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
        </div>
    );
}
