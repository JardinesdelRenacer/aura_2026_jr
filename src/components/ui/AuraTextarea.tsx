"use client";

import { useKiosk } from "@/src/hooks/useKiosk";

interface AuraTextareaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    maxLength?: number;
}

export default function AuraTextarea({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    rows = 8,
    maxLength = 500,
}: AuraTextareaProps) {

    const { openKeyboard } = useKiosk();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
                {label} {required && ( <span className="text-red-500 ml-1">*</span>)}
            </label>

            <textarea
                value={value}
                rows={rows}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white/70
                    backdrop-blue-md
                    px-5
                    py-4
                    text-slate-700
                    outline-none
                    resize-none
                    transition-all
                    duration-300
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                    shadow-sm
                "
                onFocus={() => {
                    openKeyboard();
                }}
            />

            <div className="flex justify-end text-xs text-slate-400">
                {value.length}/{maxLength}
            </div>
        </div>
    );
}