import { ReactNode } from "react";

interface CardProps { 
    children: ReactNode;

    className?: string;

    onClick?: () => void;
}

export default function Card({
    children,

    className = "",

    onClick,
}: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                rounded-[32px]
                border
                border-white/75
                backdrop-blur-xl
                shadow-xl ${className}`}
            > 
            {children}
        </div>


    );
}