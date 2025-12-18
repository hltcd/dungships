import Link from 'next/link';
import { Zap, LogOut } from 'lucide-react';
import { auth } from '@/auth';
import { logoutAction } from '@/actions/auth';
import UserMenu from '@/components/UserMenu';
import MobileNavbar from './MobileNavbar';
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const session = await auth();
  let currentUser = session?.user;

  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
        proExpiresAt: true
      }
    });
    if (dbUser) {
      currentUser = {
        ...session.user,
        ...dbUser,
        role: dbUser.role as "FREE" | "PRO" | "ADMIN"
      };
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-black/20 backdrop-blur-xl border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group hover-rocket">
              <img src="/logo.svg" alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/courses" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold transition-colors">
                Courses
              </Link>
              <Link href="/source-code" className="relative px-3 py-2 rounded-md transition-colors group">
                <span className="text-sm font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:via-red-400 group-hover:to-yellow-400">
                  Sourcecode
                </span>
                <span className="absolute -top-1 -right-2 flex items-center justify-center">
                   <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-red-500/50 animate-bounce">
                     HOT
                   </span>
                </span>
              </Link>
              {/* Only show Upgrade button if user is NOT PRO or ADMIN */}
              {(!currentUser || currentUser.role === "FREE") && (
                <Link href="/pro" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/30">
                  Nâng Cấp Pro
                </Link>
              )}
              
              {/* Admin link - only for ADMIN role */}
              {currentUser?.role === "ADMIN" && (
                <Link 
                  href="/admin" 
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </Link>
              )}
              
              {currentUser ? (
                <UserMenu user={currentUser as any} />
              ) : (
                <Link
                  href="/login"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-gray-800/30"
                >
                  Đăng Nhập
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Trigger */}
          <MobileNavbar user={currentUser as any} />
        </div>
      </div>
    </nav>
  );
}
