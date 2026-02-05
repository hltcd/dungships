"use client";

import { useState } from "react";
import { Github, Loader2, Check, AlertCircle, Info } from "lucide-react";
import { requestGithubInvite } from "@/actions/github-invite";

interface GithubInviteFormProps {
  productId: string;
  initialGithubUsername?: string;
  initialStatus?: string;
}

export default function GithubInviteForm({ 
  productId, 
  initialGithubUsername = "",
  initialStatus 
}: GithubInviteFormProps) {
  const [githubUsername, setGithubUsername] = useState(initialGithubUsername);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(initialStatus || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await requestGithubInvite(productId, githubUsername);
      if (result.success) {
        setSuccess(true);
        setStatus("PENDING");
      } else {
        setError(result.error || "Gửi yêu cầu thất bại.");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#1f1f2e] border border-gray-800 rounded-2xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
            <Github className="w-6 h-6 text-white" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">Mời vào GitHub (Private Repo)</h3>
            <p className="text-sm text-gray-400">Dành riêng cho Pro Member & Buyer</p>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm space-y-2 text-blue-100">
            <p className="font-bold">Lưu ý quan trọng:</p>
            <ul className="list-disc list-inside space-y-1 opacity-80">
                <li>Nhận Source Code qua GitHub giúp bạn **cập nhật code thường xuyên** và dễ dàng hơn.</li>
                <li>Bạn sẽ nhận được email mời từ GitHub (kiểm tra cả hộp thư Spam).</li>
                <li>Phải <strong>Chấp nhận lời mời (Accept Invite)</strong> trong email để vào repo.</li>
                <li>Đây là quy trình thủ công, thời gian xử lý từ 1-24h.</li>
            </ul>
        </div>
      </div>

      {status === "PENDING" && !success && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-xl text-sm text-yellow-200 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
              </div>
              <div>
                <p className="font-bold text-lg text-white mb-1">Đang chờ xử lý</p>
                <p className="opacity-80">Yêu cầu cho tài khoản <strong className="text-white px-1.5 py-0.5 bg-white/10 rounded">{githubUsername}</strong> đã được gửi. **Hãy nhớ kiểm tra email (cả mục Spam)** để chấp nhận lời mời sau khi Admin phê duyệt nhé!</p>
              </div>
          </div>
      )}

      {status === "INVITED" && (
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-sm text-green-300 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" strokeWidth={3} />
              </div>
              <div>
                <p className="font-bold text-lg text-white mb-1">Đã gửi lời mời!</p>
                <p className="opacity-80">Hãy kiểm tra email từ GitHub để tham gia vào Repository. Chúc bạn học tập tốt!</p>
              </div>
          </div>
      )}

      {success && !initialStatus && (
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-sm text-green-300 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" strokeWidth={3} />
              </div>
              <div>
                <p className="font-bold text-lg text-white mb-1">Gửi yêu cầu thành công!</p>
                <p className="opacity-80">Hệ thống đã ghi nhận yêu cầu của bạn. Admin sẽ gửi lời mời sớm nhất, bạn hãy **chú ý kiểm tra email và mục Spam** để Accept Invite nhé!</p>
              </div>
          </div>
      )}

      {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 text-sm text-red-400 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
          </div>
      )}

      {!status && !success && (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">GitHub Username</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="text" 
                        placeholder="e.g. dungviet0502"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        required
                        className="flex-1 bg-[#111118] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gửi yêu cầu"}
                    </button>
                </div>
            </div>
        </form>
      )}
    </div>
  );
}
