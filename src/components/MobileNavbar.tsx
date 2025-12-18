"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Shield, Settings, LogOut, BookOpen, Code, Sparkles, User as UserIcon, GraduationCap } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "FREE" | "PRO" | "ADMIN";
  proExpiresAt?: Date | null;
}

interface MobileNavbarProps {
  user?: User;
}

export default function MobileNavbar({ user }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="md:hidden">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-300 hover:text-white transition-colors"
      >
        <Menu className="w-8 h-8" />
      </button>

      {/* Overlay Menu - Ported to body */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[100] animate-in slide-in-from-right duration-300">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
           
           {/* Menu Content */}
           <div className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-[#0b0b10]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
               <div className="flex items-center gap-3">
                  <img src="/logo.svg" alt="Logo" className="w-12 h-12 object-contain" />
               </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {user?.role === 'PRO' && user.proExpiresAt && (
                   <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-3 rounded-lg border border-yellow-500/20">
                       <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-1">Thành viên PRO</p>
                       <p className="text-xs text-gray-400 font-medium">
                          Hết hạn: {new Intl.DateTimeFormat('vi-VN').format(new Date(user.proExpiresAt))}
                       </p>
                   </div>
                )}
                
              {/* Menu Links */}
              <nav className="flex flex-col space-y-2">
                <Link 
                  href="/courses" 
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-4 text-lg font-bold text-gray-400 hover:text-white py-3 px-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  <BookOpen className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  Khóa Học
                </Link>
                <Link 
                  href="/source-code" 
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-4 text-lg font-bold text-gray-400 hover:text-white py-3 px-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  <Code className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
                  Mã Nguồn
                </Link>

                {user && (
                    <Link 
                    href="/my-learning" 
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-4 text-lg font-bold text-gray-400 hover:text-white py-3 px-2 rounded-xl hover:bg-white/5 transition-all"
                    >
                    <GraduationCap className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    Góc Học Tập
                    </Link>
                )}

                {(user?.role === "FREE" || !user) && (
                   <Link 
                    href="/pro" 
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-4 text-lg font-bold text-gray-400 hover:text-white py-3 px-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-500 group-hover:text-blue-400">Nâng Cấp Pro</span>
                  </Link>
                )}

                {user?.role === 'PRO' && (
                  <Link 
                    href="/pro/payment?extend=1" 
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-4 text-lg font-bold text-gray-400 hover:text-white py-3 px-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-500 group-hover:text-yellow-400">Gia hạn Pro</span>
                  </Link>
                )}
                
                {user?.role === "ADMIN" && (
                    <Link 
                    href="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-4 text-lg font-bold text-red-500 hover:text-red-400 py-3 px-2 rounded-xl hover:bg-red-500/10 transition-all"
                    >
                    <Shield className="w-5 h-5" />
                    Trang quản trị
                    </Link>
                )}
              </nav>

              {/* User Section */}
              <div className="pt-8 mt-auto border-t border-white/5">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                        {user.image ? (
                            <img src={user.image} alt="" className="w-12 h-12 rounded-full border-2 border-white/10" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {user.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-base truncate">{user.name}</p>
                            <p className="text-gray-500 text-sm truncate">{user.email}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <Link 
                           href="/settings"
                           onClick={() => setIsOpen(false)}
                           className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group"
                        >
                            <Settings className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            <span className="text-xs font-bold text-gray-400 group-hover:text-white">Cài đặt</span>
                        </Link>
                        
                        <form action={logoutAction} className="h-full">
                            <button className="w-full h-full flex flex-col items-center justify-center gap-2 p-3 bg-red-500/5 rounded-xl hover:bg-red-500/10 transition-colors border border-red-500/10 group">
                                <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                                <span className="text-xs font-bold text-red-400 group-hover:text-red-300">Đăng xuất</span>
                            </button>
                        </form>
                    </div>
                  </div>
                ) : (
                   <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-4 text-center bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-xl transition-all shadow-lg shadow-blue-500/30"
                   >
                    Đăng Nhập / Đăng Ký
                   </Link>
                )}
              </div>
            </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
}
