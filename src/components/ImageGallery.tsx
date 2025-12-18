'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;
      if (e.key === 'Escape') setIsZoomed(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  return (
    <div className="space-y-6">
      <div 
        className="relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group aspect-video bg-[#111118] cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        {/* Main Image */}
        <div className="absolute inset-0 transition-all duration-500 ease-in-out">
            <img 
                src={images[selectedIndex]} 
                alt={`${title} - Image ${selectedIndex + 1}`} 
                className="w-full h-full object-cover"
            />
        </div>

        {/* Hover Overlay Icon */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <ZoomIn className="w-10 h-10 text-white drop-shadow-lg" />
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
            <>
                <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/80 to-transparent h-20 pointer-events-none"></div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
            {images.map((img, idx) => (
                <button 
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative w-28 h-20 md:w-24 md:h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        idx === selectedIndex ? 'border-blue-600 shadow-lg shadow-blue-600/30 ring-2 ring-blue-600/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
            ))}
          </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && typeof document !== 'undefined' && createPortal(
        <div 
            className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
            onClick={() => setIsZoomed(false)}
        >
            <button 
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2"
            >
                <X className="w-8 h-8" />
            </button>

            <img 
                src={images[selectedIndex]} 
                alt="Zoomed" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl scale-100"
                onClick={(e) => e.stopPropagation()} 
            />

            {images.length > 1 && (
                <>
                    <button 
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    <button 
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>
                </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
                {selectedIndex + 1} / {images.length}
            </div>
        </div>,
        document.body
      )}
    </div>
  );
}
