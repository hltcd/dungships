"use client";

import { useState, useTransition } from "react";
import { Copy, Check, Gift, Users } from "lucide-react";
import { createReferralCodeAction, redeemReferralAction } from "@/actions/referral";

interface ReferralPageProps {
  user: {
    referralCode: string | null;
    referralsCount: number;
    proExpiresAt: Date | null;
    referredBy: string | null;
  };
}

export default function ReferralClient({ user }: ReferralPageProps) {
  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCreateCode = () => {
    startTransition(async () => {
      await createReferralCodeAction();
    });
  };

    const handleRedeem = () => {
    if (!friendCode) return;
    startTransition(async () => {
        const result = await redeemReferralAction(0, friendCode);
        if (result.success) {
            setMessage({ type: 'success', text: result.message || "Đã nhập mã thành công!" });
        } else {
            setMessage({ type: 'error', text: result.error || "Lỗi nhập mã" });
        }
    });
  };

  const copyToClipboard = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
       {/* Hero Section */}
       <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center md:text-left relative overflow-hidden">
         <div className="relative z-10 max-w-2xl">
           <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
             Mời bạn bè, nhận PRO miễn phí!
           </h1>
           <p className="text-blue-100 text-lg mb-8">
             Nhận ngay <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">1 tuần PRO</span> khi bạn bè nhập mã và <span className="text-yellow-300 font-bold">nâng cấp gói PRO</span> thành công.
           </p>
         </div>
         <Gift className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 rotate-12" />
       </div>

       <div className="grid md:grid-cols-2 gap-8">
         {/* My Code Section */}
         <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <CodeIcon className="w-6 h-6 text-blue-400" />
             Mã giới thiệu của bạn
           </h2>
           
           {user.referralCode ? (
             <div className="space-y-4">
               <div className="bg-[#0a0a0f] border-2 border-dashed border-gray-700 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500 transition-colors cursor-pointer" onClick={copyToClipboard}>
                 <span className="text-2xl font-mono font-bold text-white tracking-wider">
                   {user.referralCode}
                 </span>
                 <button className="p-2 text-gray-400 group-hover:text-blue-400 transition-colors">
                   {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                 </button>
               </div>
               <p className="text-sm text-gray-400">
                 Chia sẻ mã này cho bạn bè. Khi họ nhập mã, bạn sẽ nhận được 7 ngày PRO.
               </p>
             </div>
           ) : (
             <div className="text-center py-6">
                <button
                  onClick={handleCreateCode}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  {isPending ? "Đang tạo..." : "Tạo mã giới thiệu ngay"}
                </button>
             </div>
           )}

           {/* Stats */}
           <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
             <div>
               <div className="text-gray-400 text-sm mb-1">Đã giới thiệu</div>
               <div className="text-2xl font-bold text-white">{user.referralsCount} người</div>
             </div>
             <div>
               <div className="text-gray-400 text-sm mb-1">Hạn PRO đến</div>
               <div className="text-xl font-bold text-yellow-400">
                 {user.proExpiresAt 
                   ? new Date(user.proExpiresAt).toLocaleDateString('vi-VN') 
                   : "Chưa kích hoạt"}
               </div>
             </div>
           </div>
         </div>

         {/* Redeem Code Section */}
         <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <Users className="w-6 h-6 text-green-400" />
             Nhập mã từ bạn bè
           </h2>

           {!user.referredBy ? (
             <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mã giới thiệu
                  </label>
                  <input
                    type="text"
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                    placeholder="VD: DUNG1234"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors uppercase font-mono"
                  />
               </div>
               
               {message && (
                 <div className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                   {message.text}
                 </div>
               )}

               <button
                 onClick={handleRedeem}
                 disabled={isPending || !friendCode}
                 className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-colors"
               >
                 {isPending ? "Đang xử lý..." : "Xác nhận"}
               </button>
               <p className="text-xs text-gray-500">
                 * Bạn chỉ có thể nhập mã một lần duy nhất.
               </p>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-48 text-center bg-[#0a0a0f] rounded-xl border border-gray-800 p-6">
               <Check className="w-12 h-12 text-green-500 mb-3" />
               <h3 className="text-white font-bold">Đã nhập mã giới thiệu</h3>
               <p className="text-gray-400 text-sm mt-1">
                 Cảm ơn bạn đã tham gia cộng đồng!
               </p>
             </div>
           )}
         </div>
       </div>
    </div>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  );
}
