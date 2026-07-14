import { ReactNode } from "react";

interface CardProps { 
    children: ReactNode;

    className?: string;
}

export default function Card({
    children,

    className = ""
}: CardProps) {
    return (
        <div 
            className={`
                rounded-[32px]
                border
                border-white/75
                backdrop-blur-xl
                shadow-xl${className}`}
            > 
            {children}
        </div>


    )
}