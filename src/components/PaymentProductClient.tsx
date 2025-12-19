"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Smartphone, Copy, Check, ArrowLeft, Loader2, Download } from "lucide-react";
import { checkPurchaseStatusAction } from "@/actions/payment-product";
import { useRouter } from "next/navigation";

interface PaymentProductClientProps {
  price: number;
  productName: string;
  productId: string;
  productSlug: string;
  accountNo: string;
  bank: string;
  description: string;
  qrUrl: string;
}

export default function PaymentProductClient({ 
  price, 
  productName,
  productId,
  productSlug,
  accountNo, 
  bank, 
  description, 
  qrUrl
}: PaymentProductClientProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const [isSuccess, setIsSuccess] = useState(false);

  // Poll for payment status
  const handleSuccessRedirect = () => {
    router.refresh();
    router.push(`/source-code/${productSlug}`);
  };

  // Poll for payment status
  useEffect(() => {
    const checkStatus = async () => {
        try {
            const purchased = await checkPurchaseStatusAction(productId);
            if (purchased) {
                setIsSuccess(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="min-h-scree pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href={`/source-code/${productSlug}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
        </Link>

        <h1 className="text-3xl font-black text-white text-center mb-2">Thanh Toán Sản Phẩm</h1>
        <p className="text-gray-400 text-center mb-12">
            Thanh toán để mở khóa tải về <span className="text-white font-bold">"{productName}"</span>
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* QR Code Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-gray-900 font-bold text-xl mb-6">Quét mã QR để thanh toán</h3>
            
            <div className="bg-white p-2 rounded-xl border-2 border-blue-100 shadow-inner mb-6 relative group cursor-pointer hover:shadow-lg transition-all">
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
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 animate-in zoom-in duration-300 shadow-lg shadow-green-500/30"
                >
                    <Download className="w-5 h-5" />
                    <span>Thanh toán thành công! Tải ngay</span>
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
            <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8">
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
                        value="NGUYEN DUNG" 
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
                    <li>Sản phẩm sẽ được <strong>kích hoạt ngay lập tức</strong> sau khi bấm xác nhận.</li>
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
