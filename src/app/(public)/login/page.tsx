'use client'

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { loginWithCredentials, loginWithGoogle } from '@/actions/auth';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-wait text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
    >
      {pending ? 'Đang đăng nhập...' : 'Đăng Nhập'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginWithCredentials, null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="bg-blue-600 p-2 rounded-full transform group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
            <Zap className="h-6 w-6 text-black fill-current" />
        </div>
        <span className="text-xl font-black text-white italic tracking-tighter">HocLapTrinh<span className="text-blue-500">CungDung</span></span>
      </Link>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md hover:shadow-blue-500/10 transition-all duration-500">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Chào Mừng Trở Lại</h2>
        <p className="text-gray-400 text-center mb-8">Đăng nhập để truy cập các khóa học pro.</p>

        <div className="space-y-4 mb-8">
           <form action={loginWithGoogle}>
             <button type="submit" className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-3 px-4 rounded-xl border border-white/10 flex items-center justify-center gap-3 transition-colors">
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
               Đăng nhập với Google
             </button>
           </form>
        </div>

        <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500 backdrop-blur-xl">Hoặc tiếp tục với email</span>
            </div>
        </div>

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
            <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.1] transition-all" 
                  placeholder="hello@example.com" 
                />
            </div>
             <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Mật Khẩu</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.1] transition-all" 
                  placeholder="••••••••" 
                />
            </div>
            
            <SubmitButton />
        </form>
        
        <p className="mt-8 text-center text-gray-400 text-sm">
            Chưa có tài khoản? <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
