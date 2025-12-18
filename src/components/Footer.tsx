import Link from 'next/link';
import { Youtube, Github, Facebook, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/[0.05] bg-black/20 backdrop-blur-md py-20 overflow-hidden">
        {/* Top Gradient Line (Optional aesthetic) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-full opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Contact / Help */}
            <div className="mb-8">
                <p className="text-gray-400 text-lg">
                    Cần trợ giúp? Email <a href="mailto:dung@hoclaptrinhcungdung.com" className="font-bold text-white hover:text-blue-400 transition-colors">dung@hoclaptrinhcungdung.com</a>
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                   <span>hoặc nhắn tin qua</span>
                   <Link href="#" className="text-blue-400 hover:text-blue-300">Facebook Page</Link>
                </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-6 mb-12">
                <a href="https://youtube.com/@hoclaptrinhcungdung" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-red-500 transition-all text-gray-400">
                    <Youtube className="w-6 h-6" />
                </a>
                <a href="https://facebook.com/hoclaptrinhcungdung" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-blue-500 transition-all text-gray-400">
                    <Facebook className="w-6 h-6" />
                </a>
                <a href="https://github.com/dungship" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-all text-gray-400">
                    <Github className="w-6 h-6" />
                </a>
               <a href="mailto:dung@hoclaptrinhcungdung.com" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-green-400 transition-all text-gray-400">
                    <Mail className="w-6 h-6" />
                </a>
            </div>

            {/* Links Section */}
            <div className="mb-12">
                <h4 className="text-gray-500 font-extrabold uppercase tracking-widest text-sm mb-6">Liên Kết Hữu Ích</h4>
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-400 font-medium md:text-base text-sm">
                    <Link href="/courses" className="hover:text-blue-400 transition-colors">Khóa Học</Link>
                    <span className="text-gray-700 hidden md:inline">|</span>
                    <Link href="/source-code" className="hover:text-blue-400 transition-colors">Source Code</Link>
                    <span className="text-gray-700 hidden md:inline">|</span>
                    <Link href="/pro" className="hover:text-blue-400 transition-colors">Nâng Cấp Pro</Link>
                    <span className="text-gray-700 hidden md:inline">|</span>
                    <Link href="/about" className="hover:text-blue-400 transition-colors">Giới Thiệu</Link>
                    <span className="text-gray-700 hidden md:inline">|</span>
                    <Link href="/privacy" className="hover:text-blue-400 transition-colors">Bảo Mật</Link>
                    <span className="text-gray-700 hidden md:inline">|</span>
                    <Link href="/terms" className="hover:text-blue-400 transition-colors">Điều Khoản</Link>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/5 pt-8">
                <p className="text-gray-600 text-sm">
                    Copyright © {currentYear} Học Lập Trình Cùng Dũng LLC
                </p>
              
            </div>
        </div>
    </footer>
  );
}
