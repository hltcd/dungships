"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, Lock, Crown, LogOut, BookOpen, Code, Gift } from "lucide-react";
import { logoutAction } from "@/actions/auth";

export default function SettingsSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/settings", label: "Hồ sơ cá nhân", icon: User },
    { href: "/settings/source-code", label: "Source Code đã mua", icon: Code },
    { href: "/settings/referral", label: "Giới thiệu bạn bè", icon: Gift },
  ];

  return (
    <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-4 h-fit sticky top-24">
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
              {link.label}
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-gray-800">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
