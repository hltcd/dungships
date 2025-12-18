"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import CourseSidebar from './CourseSidebar';

interface Lesson {
    id: string;
    title: string;
    slug: string;
    videoDuration?: number | null;
    isFree: boolean;
}

interface Course {
    slug: string;
    lessons: Lesson[];
}

interface MobileCourseMenuProps {
    course: Course;
    currentLessonSlug: string;
    completedLessonIds: string[];
    progressPercentage: number;
}

export default function MobileCourseMenu(props: MobileCourseMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const menuContent = (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 z-[9998] backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-80 bg-[#1f1f2e] border-l border-gray-800 z-[9999] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-end p-4 border-b border-gray-800">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Render the Sidebar Content */}
                <div className="h-[calc(100%-60px)]">
                    <CourseSidebar {...props} />
                </div>
            </div>
        </>
    );

    return (
        <div className="lg:hidden">
            <button 
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Open course menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {mounted && createPortal(menuContent, document.body)}
        </div>
    );
}
