"use client";

import { useEffect, useState } from "react";

interface Props {
    images: string[];
    autoPlay: boolean;
    seconds: number;
    selectedImage: number;
}

export default function Slideshow({
    images,
    autoPlay,
    seconds,
    selectedImage,
}: Props) {

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        setCurrent(0);
    }, [images]);

    useEffect(() => {
        
        if (!autoPlay) return;

        if (images.length <= 1) return;

            const interval = setInterval(() => {

                setCurrent((prev) =>
                    (prev + 1) % images.length
                );
            }, seconds * 1000);

            return () => clearInterval(interval);

    }, [images, autoPlay, seconds]);

    if (images.length === 0) {
        return null;
    }

    return (
        <img src={autoPlay ? images[current] : images[selectedImage]} alt="slide" className="w-full h-[500px] object-cover rounded"></img>
    );
}