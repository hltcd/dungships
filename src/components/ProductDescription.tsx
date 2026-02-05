"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { X, ChevronRight } from "lucide-react";

interface ProductDescriptionProps {
  content: string;
}

export default function ProductDescription({ content }: ProductDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Pre-process content to handle newlines correctly for ReactMarkdown
  const processedContent = content
    .replace(/\\n/g, "\n")
    .replace(/\n(?=[#*-])/g, "\n\n");

  return (
    <>
      <div className="relative">
        <div className="prose prose-sm prose-invert max-w-none prose-headings:text-white prose-p:text-gray-400 prose-strong:text-white prose-li:text-gray-300">
          <div className="line-clamp-5 overflow-hidden">
            <ReactMarkdown>{processedContent}</ReactMarkdown>
          </div>
        </div>
        
        {/* Gradient Overlay for "Fade out" effect */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111118] to-transparent pointer-events-none"></div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors group"
      >
        Xem thêm chi tiết
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-[#1f1f2e] border border-gray-800 w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#1f1f2e] z-10">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Chi tiết sản phẩm</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                aria-label="Đóng"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1">
              <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-li:text-gray-300 prose-img:rounded-2xl leading-relaxed">
                <ReactMarkdown>{processedContent}</ReactMarkdown>
              </div>
            </div>

            {/* Sticky Close at Bottom */}
             <div className="p-4 border-t border-gray-800 bg-[#1f1f2e]/50 backdrop-blur-sm flex justify-center">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-8 rounded-full border border-white/10 transition-all transform hover:scale-105"
                >
                    Đóng lại
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
