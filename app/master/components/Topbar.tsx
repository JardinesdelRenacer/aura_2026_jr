import React from "react";

interface TopbarProps {
    activeTab: string;
    menuItems: any[];
}

export function Topbar({ activeTab, menuItems }: TopbarProps) {
    return (
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
    );
}