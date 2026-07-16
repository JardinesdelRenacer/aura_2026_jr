"use client";

interface AuraCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    required?: boolean;
}

export default function AuraCheckbox({
    label,
    checked,
    onChange,
    required = false,
}: AuraCheckboxProps) {
    return (
        <label className="flex items-start gap-4 cursor-pointer select-none">
            <input 
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-300 "
            />
                <span className="text-sm text-slate-600 leading-6">
                    {label}

                    {required && ( <span className="text-red-500 ml-1">*</span>)}
                </span>
        </label>
    );
}