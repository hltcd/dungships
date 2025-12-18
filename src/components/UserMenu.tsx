"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User as UserIcon, Settings, Shield, Crown, CreditCard, LayoutDashboard, GraduationCap } from "lucide-react";
import { signOut } from "next-auth/react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "FREE" | "PRO" | "ADMIN";
  proExpiresAt?: Date | null;
}

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group focus:outline-none"
      >
        <div className="relative">
          {user.image ? (
            <Image
              src={user.image}
              alt="User Avatar"
              width={40}
              height={40}
              className={`rounded-full border-2 transition-all ${
                user.role === 'ADMIN' 
                  ? 'border-red-500 hover:border-red-400' 
                  : user.role === 'PRO'
                  ? 'border-yellow-500 hover:border-yellow-400'
                  : 'border-green-500 hover:border-green-400'
              }`}
            />
          ) : (
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold text-lg transition-all ${
                user.role === 'ADMIN' 
                  ? 'bg-red-500/20 border-red-500' 
                  : user.role === 'PRO'
                  ? 'bg-yellow-500/20 border-yellow-500'
                  : 'bg-green-500/20 border-green-500'
              }`}>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          {/* Status Dot */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0f] ${
             user.role === 'ADMIN' ? 'bg-red-500' : user.role === 'PRO' ? 'bg-yellow-500' : 'bg-green-500'
          }`}></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#1f1f2e] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Info */}
          <div className="p-2 border-b border-gray-800">
            {user.role === 'PRO' && (
                <Link
                  href="/pro/payment?extend=1"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-yellow-500 hover:bg-white/5 rounded-lg transition-colors mb-2"
                  onClick={() => setIsOpen(false)}
                >
                   <CreditCard className="w-4 h-4" />
                   Gia hạn Pro
                </Link>
            )}
            <div className="px-2 pb-2">
              <p className="text-white font-bold truncate">{user.name}</p>
              <p className="text-gray-500 text-xs truncate mb-2">{user.email}</p>
              
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase border ${
                  user.role === 'ADMIN' 
                    ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                    : user.role === 'PRO'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                  {user.role === 'PRO' && <Crown className="w-3 h-3" />}
                  {user.role === 'FREE' && <UserIcon className="w-3 h-3" />}
                  <span>{user.role === 'FREE' ? 'Miễn phí' : user.role === 'PRO' ? 'Thành viên Pro' : 'Quản trị viên'}</span>
                </div>
              </div>
              
              {user.role === 'PRO' && user.proExpiresAt && (
                 <p className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
                    <span className="text-gray-500">Hết hạn:</span>
                    <span className="text-gray-300">{new Intl.DateTimeFormat('vi-VN').format(new Date(user.proExpiresAt))}</span>
                 </p>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
             {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Trang quản trị
                </Link>
             )}
            <Link
              href="/my-learning"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <GraduationCap className="w-4 h-4" />
              Góc Học Tập
            </Link>
             <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Cài đặt
            </Link>
            <div className="h-px bg-gray-800 my-1"></div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
