"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Smartphone, Copy, Check, ArrowLeft, Loader2, Zap } from "lucide-react";
import { checkProStatusAction } from "@/actions/payment";
import { useRouter } from "next/navigation";

interface PaymentClientProps {
  price: number;
  accountNo: string;
  bank: string;
  description: string;
  qrUrl: string;
  planType: 'monthly' | 'yearly' | 'lifetime';
}

export default function PaymentClient({ 
  price, 
  accountNo, 
  bank, 
  description, 
  qrUrl,
  planType
}: PaymentClientProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Poll for PRO status
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isSuccess) {
        interval = setInterval(async () => {
            try {
                const isPro = await checkProStatusAction();
                if (isPro) {
                    setIsSuccess(true);
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Error checking PRO status:", e);
            }
        }, 3000); // Check every 3 seconds
    }

    return () => clearInterval(interval);
  }, [isSuccess]);

  const handleSuccessRedirect = () => {
      router.push('/settings');
      router.refresh();
  };

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/pro" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
        </Link>

        <h1 className="text-3xl font-black text-white text-center mb-2">Thanh Toán An Toàn</h1>
        <p className="text-gray-400 text-center mb-12">Hoàn tất thanh toán để kích hoạt gói PRO ngay lập tức</p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* QR Code Section */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 hover:shadow-blue-500/10 transition-all">
            <h3 className="text-white font-bold text-xl mb-6">Quét mã QR để thanh toán</h3>
            
            <div className="bg-white p-2 rounded-xl border-2 border-white shadow-inner mb-6 relative group cursor-pointer hover:shadow-lg transition-all">
                 <img 
                    src={qrUrl} 
                    alt="Payment QR Code" 
                    className="w-64 h-64 md:w-80 md:h-80 object-contain"
                 />
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-100 mb-6">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
                <span>Hệ thống tự động xác nhận</span>
            </div>
            
            {isSuccess ? (
                <button 
                    onClick={handleSuccessRedirect}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 animate-in zoom-in duration-300 shadow-lg shadow-orange-500/30"
                >
                    <Zap className="w-5 h-5 fill-current" />
                    <span>Nâng cấp thành công! Vào Dashboard</span>
                </button>
            ) : (
                <div className="w-full bg-blue-500/5 border border-blue-500/20 text-blue-400 text-sm font-medium py-4 rounded-xl flex flex-col items-center justify-center gap-2 mt-2">
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang chờ thanh toán...</span>
                    </div>
                    <p className="text-gray-500 text-[10px]">Tự động duyệt sau 1-3 phút</p>
                </div>
            )}
            
            <p className="text-xs text-gray-500 mt-6 text-center">
                Powered by <span className="font-bold text-gray-400">SePay</span>
            </p>
          </div>

          {/* Instruction Section */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    Thông tin chuyển khoản thủ công
                </h3>
                
                <div className="space-y-4">
                    <InfoRow 
                        label="Ngân hàng" 
                        value={`${bank} (Quân Đội)`} 
                    />
                    <InfoRow 
                        label="Chủ tài khoản" 
                        value="NGUYEN DUNG" // Assuming hardcoded for now or passed from parent if available
                    />
                    <InfoRow 
                        label="Số tài khoản" 
                        value={accountNo} 
                        featured
                        onCopy={() => handleCopy(accountNo, 'acc')}
                        isCopied={copiedField === 'acc'}
                    />
                    <InfoRow 
                        label="Số tiền" 
                        value={`${price.toLocaleString('vi-VN')} đ`} 
                    />
                    <InfoRow 
                        label="Nội dung CK" 
                        value={description} 
                        featured 
                        highlight
                        onCopy={() => handleCopy(description, 'des')}
                        isCopied={copiedField === 'des'}
                    />
                </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-6">
                <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Lưu ý quan trọng:
                </h4>
                <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                    <li>Nhập chính xác <strong>Nội dung chuyển khoản</strong>.</li>
                    <li>Tài khoản sẽ được nâng cấp PRO <strong>ngay lập tức</strong> khi hệ thống nhận được tiền.</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ 
    label, 
    value, 
    featured, 
    highlight, 
    onCopy, 
    isCopied 
}: { 
    label: string, 
    value: string, 
    featured?: boolean, 
    highlight?: boolean, 
    onCopy?: () => void, 
    isCopied?: boolean 
}) {
    return (
        <div className="flex items-start justify-between group gap-4">
            <span className="text-gray-400 text-sm py-1 shrink-0">{label}</span>
            <div className={`flex items-start justify-end gap-3 text-right flex-1 ${highlight ? 'text-yellow-400 font-black text-lg' : 'text-white font-medium'}`}>
                <span className={`${featured ? "font-mono tracking-wide break-all" : "break-words"}`}>{value}</span>
                {onCopy && (
                    <button 
                        onClick={onCopy}
                        className={`p-1.5 rounded-lg transition-all shrink-0 mt-0.5 ${
                            isCopied 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                        title="Sao chép"
                    >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    )
}
