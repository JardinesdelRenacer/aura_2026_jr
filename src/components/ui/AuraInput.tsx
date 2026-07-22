"use client";

import React from "react";
import { useKiosk } from "@/src/hooks/useKiosk";

interface AuraInputProps {
    label: string;
    value: string;
    onChange: (value:string)=>void;
    placeholder?: string;
    type?: string;
    required?: boolean;
}

export default function AuraInput({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
}: AuraInputProps) {

    const { openKeyboard } = useKiosk();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
                {label}

                {required && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="h-14 rounded-2xl border boder-slate-200 bg-white/70 backdrop-blur-md px-5 text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm" 
                onFocus={() => {
                    openKeyboard();
                }}
            />

        </div>
    )
}