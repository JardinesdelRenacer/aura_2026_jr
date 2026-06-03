"use client";

import Slideshow from "./Slideshow";

interface Props{
    images: string[];
    autoPlay: boolean;
    seconds: number;
}

export default function SlideshowViewer({
    images,
    autoPlay,
    seconds,
}: Props) {

    return (
        <div className="w-screen h-screen bg-black">
            <Slideshow
                images={images}
                autoPlay={autoPlay}
                seconds={seconds}
                selectedImage={0}>
            </Slideshow>
        </div>
    );
}