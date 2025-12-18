"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Package, 
  Users, 
  Star, 
  ShoppingCart,
  Zap,
  LogOut
} from "lucide-react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Khóa học", icon: BookOpen },
  { href: "/admin/products", label: "Source Code", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#111118] border-r border-gray-800 flex flex-col fixed h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-white fill-current" />
          </div>
          <span className="text-lg font-black text-white">Admin</span>
        </Link>
      </div>

      {/* Back to Home Button */}
      <div className="px-4 pt-4 pb-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors group w-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium">Về Trang Chủ</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-blue-400"}`} />
              <span className={`font-medium ${isActive ? "font-bold" : ""}`}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          {user.image ? (
            <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0) || "A"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
