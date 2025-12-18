'use client'

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { registerUser, loginWithGoogle } from '@/actions/auth';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-wait text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
    >
      {pending ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/login?registered=true');
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="bg-blue-600 p-2 rounded-full transform group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
            <Zap className="h-6 w-6 text-black fill-current" />
        </div>
        <span className="text-xl font-black text-white italic tracking-tighter">HocLapTrinh<span className="text-blue-500">CungDung</span></span>
      </Link>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md hover:shadow-blue-500/10 transition-all duration-500">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Tạo Tài Khoản</h2>
        <p className="text-gray-400 text-center mb-8">Tham gia cộng đồng và bắt đầu học ngay.</p>

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
            <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Họ Tên</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.1] transition-all" 
                  placeholder="Nguyễn Văn A" 
                />
            </div>
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
                <label className="block text-gray-400 text-sm font-bold mb-2">Mật Khẩu (ít nhất 6 ký tự)</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  minLength={6}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.1] transition-all" 
                  placeholder="••••••••" 
                />
            </div>
            
            <SubmitButton />
        </form>

        <div className="relative my-6">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500 backdrop-blur-xl">Hoặc</span>
            </div>
        </div>

        <form action={loginWithGoogle}>
          <button type="submit" className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-3 px-4 rounded-xl border border-white/10 flex items-center justify-center gap-3 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              Đăng ký với Google
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
            Đã có tài khoản? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
