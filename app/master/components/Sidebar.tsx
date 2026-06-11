import React from "react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    menuItems: any[];
    user: any;
    handleLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, menuItems, user, handleLogout }: SidebarProps) {
    return (
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
                            <span className="text-[10px] font-semibold text-slate-500">{user?.email ? user.email.charAt(0).toUpperCase() + user.email.slice(1) : "Correo no disponible"}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors border border-red-100">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </aside>
    );
}