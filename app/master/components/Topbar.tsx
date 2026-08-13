import React from "react";

interface TopbarProps {
    activeTab: string;
    menuItems: any[];
    onOpenMenu: () => void;
}

export function Topbar({ activeTab, menuItems, onOpenMenu }: TopbarProps) {
    return (
        <header className="z-10 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-xs sm:px-8">
            <div className="flex items-center gap-2">
                <button type="button" onClick={onOpenMenu} className="mr-1 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700 lg:hidden" aria-label="Abrir menú">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                    {menuItems.find(i => i.id === activeTab)?.label}
                </h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="hidden text-xs font-bold uppercase tracking-wide sm:inline">Sistemas en línea</span>
                </div>
            </div>
        </header>
    );
}
