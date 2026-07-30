import { cva } from "class-variance-authority";

export const inputVariants = cva([
    "h-14",
    "rounded-2xl",
    "border",
    "px-5",
    "transtition-all",
    "duration-300",
    "outline-none",
    "shadow-sm",
    "focus:ring-4",
],
{
    variants: {
        variant: {
            default: "border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:ring-blue-100",
            filled: "border-transparent bg-slate-100 text-slate-700 focus:border-blue-500 focus:ring-blue-100",
            ghost: "border-transparent bg-transparent text-slate-700 focus:border-blue-500 focus:ring-blue-100",
            glass: "border-white/20 bg-white/50 backdrop-blur-xl text-slate-700 focus:border-blue-500 focus:ring-blue-100",
        },

        size: {
            sm: "h-10 text-sm",
            md: "h-14 text-base",
            lg: "h-16 text-lg",
        },
    },

    defaultVariants: {
        variant: "default",
        size: "md",
    },
});