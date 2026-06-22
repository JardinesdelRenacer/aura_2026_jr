"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

interface Props {
    media: {url: string, type: string}[];
    autoPlay: boolean;
    seconds: number;
    selectedImage: number;
    onCompleteCycle?: () => void;
    transitionEffect?: string;
}

const ANIMATION_STYLES = (
    <style>{`
        .animate-fade-in { animation: fadeIn 1s ease-in-out; }
        .animate-slide-in { animation: slideIn 1s ease-out; }
        .animate-zoom-in { animation: zoomIn 1s ease-out; }
        .animate-blur-in { animation: blurIn 1s ease-out; }
        .animate-flip-in { animation: flipIn 1s ease-out; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes blurIn { from { filter: blur(15px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
        @keyframes flipIn { from { transform: perspective(1000px) rotateX(-5deg); opacity: 0; } to { transform: perspective(1000px) rotateX(0); opacity: 1; } }
    `}</style>
);

export default function Slideshow({
    media,
    autoPlay,
    seconds,
    selectedImage,
    onCompleteCycle,
    transitionEffect = "fade"
}: Props) {

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => setCurrent(0), 0);
        return () => clearTimeout(timeout);
    }, [media]);

    useEffect(() => {
        if (!autoPlay || media.length === 0) return;

        const currentMedia = media[current];
        let timeout: NodeJS.Timeout;

        const handleNext = () => {
            const completesCycle = current === media.length - 1;

            if (completesCycle) {
                onCompleteCycle?.();
            }

            setCurrent((prev) => (prev + 1) % media.length);
        };

        if (currentMedia?.type !== 'video') {
            timeout = setTimeout(handleNext, (seconds || 5) * 1000);
        } else if (currentMedia?.type === 'video') {
            // Para videos, el cambio de diapositiva lo maneja el evento onEnded nativo del elemento <video>
        }

        return () => clearTimeout(timeout);
    }, [media, autoPlay, seconds, current, onCompleteCycle]);

    if (media.length === 0) {
        return null;
    }

    const currentItem = autoPlay ? media[current] : media[selectedImage];

    if (!currentItem) return null;

    const getAnimationClass = () => {
        switch(transitionEffect) {
            case "fade": return "animate-fade-in";
            case "slide": return "animate-slide-in";
            case "zoom": return "animate-zoom-in";
            case "blur": return "animate-blur-in";
            case "flip": return "animate-flip-in";
            default: return "";
        }
    };

    if (currentItem.type === 'video') {
        return (
            <div key={autoPlay ? current : selectedImage} className={`relative h-full w-full overflow-hidden bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 ${getAnimationClass()}`}>
                {ANIMATION_STYLES}
                <video
                    src={currentItem.url}
                    autoPlay={autoPlay}
                    muted
                    playsInline
                    loop
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
                />
                <div className="absolute inset-0 bg-black/15" />
                <video
                    src={currentItem.url}
                    autoPlay={autoPlay}
                    muted
                    playsInline
                    controls={!autoPlay}
                    onEnded={(e) => {
                        if (autoPlay) {
                            const completesCycle = current === media.length - 1;

                            if (completesCycle) {
                                onCompleteCycle?.();
                            }

                            if (media.length > 1) {
                                setCurrent((prev) => (prev + 1) % media.length);
                            } else if (media.length === 1) {
                                // Forzar repetición en bucle infinito para 1 solo video
                                e.currentTarget.currentTime = 0;
                                e.currentTarget.play();
                            }
                        }
                    }}
                    className="relative z-10 h-full w-full object-contain"
                />
            </div>
        );
    }

    return (
        <div key={autoPlay ? current : selectedImage} className={`relative h-full w-full overflow-hidden bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 ${getAnimationClass()}`}>
            {ANIMATION_STYLES}
            <img src={currentItem.url} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl" />
            <div className="absolute inset-0 bg-black/15" />
            <img src={currentItem.url} alt="slide" className="relative z-10 h-full w-full object-contain" />
        </div>
    );
}
