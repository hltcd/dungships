"use client";

import { useEffect, useRef } from "react";

interface VideoWatermarkProps {
    text: string;
}

export default function VideoWatermark({ text }: VideoWatermarkProps) {
    const watermarkRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const watermark = watermarkRef.current;
        if (!watermark) return;

        // Parent container (the video wrapper)
        const container = watermark.parentElement;
        if (!container) return;

        // Protect against removal
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // If watermark is removed
                if (mutation.type === "childList") {
                    const removedNodes = Array.from(mutation.removedNodes);
                    const isRemoved = removedNodes.some((node) => node === watermark);
                    if (isRemoved) {
                        // Re-append immediately
                        container.appendChild(watermark);
                    }
                }
                
                // If watermark style is tampered (e.g. display: none, opacity: 0)
                if (mutation.type === "attributes" && mutation.target === watermark) {
                    if (watermark.style.display === "none" || watermark.style.opacity === "0" || watermark.style.visibility === "hidden") {
                        watermark.style.display = "block";
                        watermark.style.opacity = "0.3";
                        watermark.style.visibility = "visible";
                    }
                }
            });
        });

        observer.observe(container, { childList: true, subtree: true });
        observer.observe(watermark, { attributes: true, attributeFilter: ["style", "class"] });

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={watermarkRef}
            className="absolute inset-0 z-50 pointer-events-none flex items-end justify-end p-4 opacity-30 select-none overflow-hidden"
            style={{ pointerEvents: 'none' }} // Double insurance
        >
            <div className="text-xs text-white/50 font-mono rotate-[-15deg] whitespace-nowrap">
                {text}
            </div>
            {/* Random floating elements for extra annoyance if they try to crop */}
             <div className="absolute top-10 left-10 text-xs text-white/10 font-mono rotate-[15deg]">
                {text}
            </div>
             <div className="absolute top-1/2 left-1/2 text-xs text-white/10 font-mono -translate-x-1/2 -translate-y-1/2">
                {text}
            </div>
        </div>
    );
}
