"use client";

import { createCourseAction } from "@/actions/courses";
import { Plus, X, Video, Image as ImageIcon, Loader2 } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";
import PriceInput from "@/components/admin/PriceInput";
import Link from "next/link";
import { useState } from "react";

export default function AdminCoursesNewPage() {
    const [image, setImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError("");
        
        // Append image from state if not already in form (hidden input usage)
        formData.set("image", image);

        const res = await createCourseAction(formData);
        
        if (res?.error) {
            setError(res.error);
            setIsSubmitting(false);
        }
        // Redirect handled by server action
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Tạo Khóa Học Mới</h1>
                <p className="text-gray-400 mt-2 text-lg">Thiết lập thông tin cơ bản cho khóa học của bạn</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {error}
                </div>
            )}

            <form action={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Left Column) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className="bg-[#1f1f2e] border border-gray-800 rounded-3xl p-8 space-y-6 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Video className="w-5 h-5 text-blue-500" />
                                Thông Tin Cơ Bản
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Tên Khóa Học <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        placeholder="VD: Master Next.js 14"
                                        className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-lg font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Slug (URL) <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="slug"
                                        required
                                        placeholder="master-nextjs-14"
                                        className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Mô Tả Ngắn</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Mô tả ngắn gọn về nội dung khóa học..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right Column) */}
                    <div className="space-y-8">
                        {/* Price & Status */}
                        <div className="bg-[#1f1f2e] border border-gray-800 rounded-3xl p-8 space-y-6 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-4">Cài Đặt</h2>
                            
                            <PriceInput 
                                name="price" 
                                label="Giá Bán (VNĐ)" 
                                placeholder="0" 
                                required 
                            />

                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        className="w-5 h-5 rounded border-gray-700 bg-[#111118] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-all"
                                    />
                                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">Xuất bản công khai</span>
                                </label>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="bg-[#1f1f2e] border border-gray-800 rounded-3xl p-8 space-y-6 shadow-xl">
                             <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-purple-500" />
                                Hình Ảnh
                            </h2>
                            <FileUpload 
                                label="Thumbnail Khóa Học"
                                value={image}
                                onChange={setImage}
                                accept="image/*"
                                type="image"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="fixed bottom-0 left-0 right-0 bg-[#1f1f2e]/80 backdrop-blur-xl border-t border-gray-800 p-4 z-40">
                    <div className="max-w-5xl mx-auto flex items-center justify-end gap-4">
                        <Link
                            href="/admin/courses"
                            className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors"
                        >
                            Hủy Bỏ
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transform"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Plus className="w-5 h-5" />
                            )}
                            {isSubmitting ? "Đang xử lý..." : "Tạo Khóa Học"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
