import React, { useState, useRef, useEffect } from "react";

export const PantallaEscalada = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setScale(entry.contentRect.width / 1920);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-slate-900">
            <div className="absolute top-0 left-0 origin-top-left" style={{ width: '1920px', height: '1080px', transform: `scale(${scale})` }}>
                <iframe src="/Pantalla" className="w-full h-full border-0 pointer-events-none" tabIndex={-1} />
            </div>
        </div>
    );
};