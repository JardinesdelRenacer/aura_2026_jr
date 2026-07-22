"use client";

import React from "react";
import { useKiosk } from "@/src/hooks/useKiosk";

interface AuraSelectOption {
    value: string;
    label: string;
}

interface AuraSelectProps{
    label: string;
    value: string;
    options: AuraSelectOption[];
    onChange: (value:string)=>void;
    required?: boolean;
}

export default function AuraSelect({
    label,
    value,
    options,
    onChange,
    required = false,
}: AuraSelectProps ) {

    const { openKeyboard } = useKiosk();
    // Hacer prueba si necesita teclado o no en este "Selector"

    return (
        <div className="flex flex-col gap-2">

            <label className="text-sm font-samibold text-slate-700">
                {label}
                {required} && (
                    <span className="text-red-500 ml-1">*</span>
                )
            </label>

            <select 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    h-14
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white/70
                    backdrop-blur-md
                    px-5
                    text-slate-700
                    outline-none
                    transition-all
                    duration-300
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                    shadow-sm
                "
                onFocus={() => {
                    openKeyboard();
                }}
            >
                <option value="">
                    Seleccione...
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

