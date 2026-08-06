"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface WelcomeScreenProps {
    onStart: () => void;
}

export default function WelcomeScreen({
    onStart,
}: WelcomeScreenProps) {
    return (
        <main className="flex min-h-screen items-center justify-center p-12">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 25,
                    scale: 0.97,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full max-w-5xl rounded-[40px] border border-white/70 bg-white/75 p-20 text-center shadow-2xl backdrop-blur-xl"
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.8,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        delay: 0.15,
                        type: "spring",
                        stiffness: 180,
                        damping: 16,
                    }}
                >
                    <Image
                        src="/imagenes/logo_jr.png"
                        alt="Jardines del Renacer"
                        width={130}
                        height={130}
                        priority
                        className="mx-auto"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-8 text-6xl font-bold text-slate-800"
                >
                    Jardines del Renacer
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-4 text-2xl font-semibold uppercase tracking-[0.35em] text-blue-700"
                >
                    Condolencias Digitales
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="mx-auto mt-10 max-w-3xl text-2xl leading-relaxed text-slate-700"
                >
                    Un mensaje sincero puede
                    convertirse en un recuerdo que
                    acompañe a la familia para
                    siempre.
                </motion.p>

                <motion.button
                    type="button"
                    onClick={onStart}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    whileHover={{
                        scale: 1.04,
                        y: -3,
                    }}
                    whileTap={{
                        scale: 0.96,
                    }}
                    className="mt-16 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 px-24 py-6 text-2xl font-bold text-white shadow-xl"
                >
                    Comenzar
                </motion.button>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 text-slate-400"
                >
                    Toque el botón para comenzar.
                </motion.p>
            </motion.div>
        </main>
    );
}