"use client";

import { useRef, useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import VideoWatermark from "./VideoWatermark";

interface SecureVideoPlayerProps {
    videoUrl: string;
    watermarkText: string;
}

export default function SecureVideoPlayer({ videoUrl, watermarkText }: SecureVideoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full relative group bg-black"
        >
            {/* Watermark is always inside the container */}
            <VideoWatermark text={watermarkText} />

            {/* The Iframe */}
            <iframe 
                src={videoUrl} 
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                // REMOVE 'allowfullscreen' attribute from here to discourage native button usage? 
                // Actually, removing it might break the native button, which is GOOD for us.
                // We want to force usage of OUR button.
                // But some browsers might block it entirely. Let's keep it but Overlay our button.
                // allowFullScreen 
            />

            {/* Custom Fullscreen Button Overlay - Top Right to avoid controls */}
            <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-50 p-2.5 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-95 hover:scale-105 shadow-lg border border-white/10"
                title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            >
                {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                ) : (
                    <Maximize className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
