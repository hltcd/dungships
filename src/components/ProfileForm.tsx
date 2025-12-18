"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/actions/user";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  bio?: string | null;
  image?: string | null;
  role: "FREE" | "PRO" | "ADMIN";
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Alert Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name || "User"} 
              className="w-24 h-24 rounded-full border-4 border-[#1f1f2e]" 
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-[#1f1f2e]">
              {user.name?.charAt(0) || "U"}
            </div>
          )}
          {/* Status Dot */}
          <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#0a0a0f] ${user.role === 'ADMIN' ? 'bg-red-500' : user.role === 'PRO' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{user.name}</h3>
          <p className="text-gray-400 text-sm">{user.email}</p>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {user.role} Member
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tên hiển thị
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user.name || ""}
            className="w-full px-4 py-3 bg-[#1f1f2e] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Giới thiệu bản thân (Bio)
          </label>
          <textarea
            name="bio"
            rows={4}
            defaultValue={user.bio || ""}
            placeholder="Chia sẻ đôi chút về bản thân bạn..."
            className="w-full px-4 py-3 bg-[#1f1f2e] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-800">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
