// "use client";

// import { ButtonHTMLAttributes } from "react";
// import { cva, VariantProps } from "class-variance-authority"

// import { cn } from "@/src/lib/cn";

// const buttonVariants = cva([
//     "inline-flex",
//     "items-center",
//     "justify-center",
//     "rounded-[20px]",
//     "font-semibold",
//     "transition-all",
//     "duration-200",
//     "select-none",
//     "disable:pointer-events-none",
//     "disabled:opacity-50",
//     "focus:outline-none",
//     "active:scale-[0.98]",
// ],
// {
//     variants: {
//         variant: {
//             primary: "bg-[#977660] text-white hover:bg-[#87654] shadow-md",
//             secundary: "bg-white border border-[#ECE9E4] text-[#2F2F2F] hover:bg-[#f8f7f5]",
//             ghost: "bg-transparent hover:bg-[#F3F1EE] text-[#2F2F2F]",
//             danger: "bg-red-600 text-white hover:bg-red-700",
//         },

//         size: {
//             sm: "h-10 px-4 text-sm",
//             md: "h-12 px-6 text-base",
//             lg: "h-14 px-8 text-lg",
//         },

//         fullWidth: {
//             true: "w-full",
//             false: "",
//         },
//     },

//     defaultVariants: {
//         variant: "primary",

//         size: "lg",

//         fullWidth: false,
//     },
// });

// export interface AuraButtonProps
//     extends ButtonHTMLAttributes<HTMLButtonElement>,
//         VariantProps<typeof buttonVariants> {
        
//     loading?: boolean;
// }

// export function AuraButton({
//     className,
//     variant,
//     size,
//     fullWidth,
//     loading,
//     children,
//     disabled,
//     ...props
// }: AuraButtonProps) {
//     return (
//         <button className={cn(buttonVariants({variant, size, fullWidth}), className)} disabled={disabled || loading} {...props}>
//             {loading ? (
//                 <>
//                     <svg className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-90" fill="currentColor" d="M22 12A10 10 0 00-10-10v4a6 6 0 016 6h4z" />

//                         Cargando...
//                     </>
//             ) : (
//                 children
//             )}
//         </button>
//     );
// }

"use client";

import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/cn";

const buttonVariants = cva(
    [
        "inline-flex",
        "items-center",
        "justify-center",
        "gap-2",
        "rounded-[20px]",
        "font-semibold",
        "transition-all",
        "duration-200",
        "select-none",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "focus:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#977660]/40",
        "active:scale-[0.98]",
    ],
    {
        variants: {
            variant: {
                primary:
                    "bg-[#977660] text-white shadow-md hover:bg-[#876550]",
                secondary:
                    "border border-[#ECE9E4] bg-white text-[#2F2F2F] hover:bg-[#F8F7F5]",
                ghost:
                    "bg-transparent text-[#2F2F2F] hover:bg-[#F3F1EE]",
                danger:
                    "bg-red-600 text-white hover:bg-red-700",
            },

            size: {
                sm: "h-10 px-4 text-sm",
                md: "h-12 px-6 text-base",
                lg: "h-14 px-8 text-lg",
            },

            fullWidth: {
                true: "w-full",
                false: "",
            },
        },

        defaultVariants: {
            variant: "primary",
            size: "lg",
            fullWidth: false,
        },
    }
);

export interface AuraButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    loading?: boolean;
}

export function AuraButton({
    className,
    variant,
    size,
    fullWidth,
    loading = false,
    children,
    disabled,
    type = "button",
    ...props
}: AuraButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            className={cn(
                buttonVariants({
                    variant,
                    size,
                    fullWidth,
                }),
                className
            )}
            disabled={isDisabled}
            aria-busy={loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-20"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />

                        <path
                            className="opacity-90"
                            fill="currentColor"
                            d="M22 12a10 10 0 0 0-10-10v4a6 6 0 0 1 6 6h4Z"
                        />
                    </svg>

                    <span>Cargando...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}