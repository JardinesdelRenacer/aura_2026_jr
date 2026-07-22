"use client";

import { Obituary } from "@/src/types/obituary";
import Card from "./ui/Card";
import Image from "next/image";

export interface ObituaryCardProps{
    id: string;

    name: string;

    surname: string;

    roomName: string;

    status?: "ACTIVO" | "FINALIZADO";

    startTime?: string;

    endTime?: string;

    description?: string;

    onSelect:()=>void;
}

export default function ObituaryCard({
    name,
    surname,
    roomName,
    description,
    onSelect,
}: ObituaryCardProps) {
    return (
        <Card onClick={onSelect} className="group cursor-pointer p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-400">

            {/* Logo */}
            <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                    <Image src="/imagenes/logo_jr.png" alt="Jardines del Renacer" width={55} height={55} />
                </div>
            </div>

            {/* Nombre */}
            <h2 className="mt-6 text-center text-3xl font-bold text-slate-800">
                {name} {surname}
            </h2>

            {/* Sala */}
            <p className="mt-2 text-center text-blue-700 font-semibold text-lg">
                {roomName}
            </p>

            {/* Linea */}
            <div className="my-6 h-px bg-grandient-to-r from-transparent via-blue-200 to-transparent" />

            {/* Descripción */}
            <p className="text-center leading-7 text-slate-500 min-h-[70px]">
                {description}
            </p>

            {/* Linea */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

            {/* Btn */}
            <div className="flex items-center justify-center gap-3 text-blue-700 font-semibold text-lg group-hover:gap-5 transition-all">
                <span>Escribir mensaje</span>

                <span className="text-2xl">→</span>
            </div>
        </Card>    
    );
}
