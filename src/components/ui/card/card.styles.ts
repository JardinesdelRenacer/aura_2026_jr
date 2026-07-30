import { cva } from "class-variance-authority";

export const cardVariants = cva([
    "rounded-3xl",
    "transtition-all",
    "duration-300",
    "border",
    "overflow-hidden",
],
{
    variants: {
        variant: {
            default: "bg-white border-slate-200 shadow-sm",

            glass: "bg-white/50 backdrop-blur-xl border-white/28 shadow-lg",

            outline: "bg-transparent border-slate-300",

            gradient: "bg-grandient-to-br from-white to-slate-100 border-slate-200 shadow-md",
        },

        padding: {
            none: "p-0",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
            xl: "p-10",
        },

        hover: {
            true: "hover:shadow-xl hover:-translate-y-1",
            
            false: "",
        },

        clickable: {
            true: "cursor-pointer active:scale-[0.98]",
            false: "",
        },
    },

    defaultVariants: {
        variant: "default",

        padding: "md",

        hover: false,

        clickable: false,
    },
});