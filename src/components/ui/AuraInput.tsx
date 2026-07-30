"use client";

import { useId } from "react";
import type {
    FocusEventHandler,
    InputHTMLAttributes,
} from "react";
import type { VariantProps } from "class-variance-authority";

import { useKiosk } from "@/src/hooks/useKiosk";
import { cn } from "@/src/lib/cn";
import { inputVariants } from "./input.styles";

export interface AuraInputProps
    extends Omit<
            InputHTMLAttributes<HTMLInputElement>,
            "size" | "onChange" | "value"
        >,
        VariantProps<typeof inputVariants> {
    label: string;
    value: string;
    onChange: (value: string) => void;

    helperText?: string;
    error?: string;
    success?: string;

    fullWidth?: boolean;
}

export default function AuraInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,

    variant,
    size,

    helperText,
    error,
    success,

    fullWidth = true,

    className,
    onFocus,
    disabled,
    ...props
}: AuraInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const { openKeyboard } = useKiosk();

    const messageId =
        error || success || helperText
            ? `${inputId}-message`
            : undefined;

    const handleFocus: FocusEventHandler<HTMLInputElement> = (
        event
    ) => {
        if (!disabled) {
            openKeyboard();
        }

        onFocus?.(event);
    };

    return (
        <div
            className={cn(
                "flex flex-col gap-2",
                fullWidth && "w-full"
            )}
        >
            <label
                htmlFor={inputId}
                className="text-sm font-semibold text-slate-700"
            >
                {label}

                {required && (
                    <span
                        className="ml-1 text-red-500"
                        aria-hidden="true"
                    >
                        *
                    </span>
                )}
            </label>

            <input
                {...props}
                id={inputId}
                type={type}
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={messageId}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                onFocus={handleFocus}
                className={cn(
                    inputVariants({
                        variant,
                        size,
                    }),
                    fullWidth && "w-full",
                    error &&
                        "border-red-500 focus:border-red-500 focus:ring-red-100",
                    success &&
                        !error &&
                        "border-green-500 focus:border-green-500 focus:ring-green-100",
                    className
                )}
            />

            {helperText && !error && !success && (
                <p
                    id={messageId}
                    className="text-sm text-slate-500"
                >
                    {helperText}
                </p>
            )}

            {error && (
                <p
                    id={messageId}
                    role="alert"
                    className="text-sm text-red-500"
                >
                    {error}
                </p>
            )}

            {success && !error && (
                <p
                    id={messageId}
                    className="text-sm text-green-600"
                >
                    {success}
                </p>
            )}
        </div>
    );
}