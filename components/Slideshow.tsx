"use client";

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
        setCurrent(0);
    }, [media]);

    useEffect(() => {
        
        if (!autoPlay) return;

        const currentMedia = media[current];
        let timeout: NodeJS.Timeout;

        const handleNext = () => {
            if (current === media.length - 1 && onCompleteCycle) {
                onCompleteCycle();
            }
            if (media.length > 1) {
                setCurrent((prev) => (prev + 1) % media.length);
            } else if (media.length === 1 && onCompleteCycle) {
                onCompleteCycle(); // If there's only 1 item, still trigger cycle complete
            }
        };

        if (currentMedia?.type !== 'video') {
            timeout = setTimeout(handleNext, seconds * 1000);
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
            <>
                {ANIMATION_STYLES}
            <video 
                key={autoPlay ? current : selectedImage} 
                src={currentItem.url} 
                autoPlay={autoPlay} 
                muted 
                controls={!autoPlay}
                onEnded={() => {
                    if (autoPlay) {
                        if (current === media.length - 1 && onCompleteCycle) {
                            onCompleteCycle();
                        }
                        if (media.length > 1) {
                            setCurrent((prev) => (prev + 1) % media.length);
                        } else if (media.length === 1 && onCompleteCycle) {
                            onCompleteCycle();
                        }
                    }
                }}
                className={`w-full h-full object-contain bg-black ${getAnimationClass()}`}
            />
            </>
        );
    }

    return (
        <>
            {ANIMATION_STYLES}
            <img key={autoPlay ? current : selectedImage} src={currentItem.url} alt="slide" className={`w-full h-full object-contain bg-black ${getAnimationClass()}`}></img>
        </>
    );
}