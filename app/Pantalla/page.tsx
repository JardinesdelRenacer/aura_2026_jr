"use client";

import { useEffect, useState } from "react";
import Slideshow from "@/components/Slideshow";

export default function Pantalla() {

    const [images, setImages] = useState<string[]>([]);

    const [autoPlay, setAutoplay] = useState(true);

    const [seconds, setSeconds] = useState(10);

    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const data =
            localStorage.getItem("presentacion");

        if (!data) return;

        const parsed = JSON.parse(data);

        setImages(parsed.images);
        setAutoplay(parsed.autoPlay);
        setSeconds(parsed.seconds);
        setSelectedImage(parsed.selectedImage ?? 0);

    }, []);

    return (
        <div className="w-screen h-screen bg-black">
            <Slideshow images={images} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage}></Slideshow>
        </div>
    );
}