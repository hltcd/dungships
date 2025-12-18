"use client";

import { createLessonAction, updateLessonAction } from "@/actions/lessons";
import VideoUploaderClient from "@/components/VideoUploaderClient";
import { Plus, Save, X, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Resource {
    title: string;
    url: string;
}

interface LessonFormProps {
    courseId: string;
    courseSlug: string;
    lesson?: {
        id: string;
        title: string;
        slug: string;
        description: string | null;
        content: string | null;
        videoId: string | null;
        videoUrl: string | null;
        order: number;
        isFree: boolean;
        resources: any; // Using any to handle Json type from Prisma
    };
    isEditMode?: boolean;
}

export default function LessonForm({ courseId, courseSlug, lesson, isEditMode = false }: LessonFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || "");
    const [videoId, setVideoId] = useState(lesson?.videoId || "");
    
    // Parse existing resources or default to empty array
    const initialResources: Resource[] = Array.isArray(lesson?.resources) 
        ? (lesson?.resources as Resource[]) 
        : [];
    const [resources, setResources] = useState<Resource[]>(initialResources);

    const addResource = () => {
        setResources([...resources, { title: "", url: "" }]);
    };

    const removeResource = (index: number) => {
        setResources(resources.filter((_, i) => i !== index));
    };

    const updateResource = (index: number, field: keyof Resource, value: string) => {
        const newResources = [...resources];
        newResources[index] = { ...newResources[index], [field]: value };
        setResources(newResources);
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError("");

        // Validation
        const title = formData.get("title") as string;
        if (!title.trim()) {
            setError("Vui lòng nhập tiêu đề bài học");
            setIsSubmitting(false);
            return;
        }

        if (videoUrl) {
             try {
                 new URL(videoUrl);
             } catch (e) {
                 setError("Link video không hợp lệ");
                 setIsSubmitting(false);
                 return;
             }
        }

        // Append context data
        formData.set("courseId", courseId);
        formData.set("courseSlug", courseSlug);
        
        // Ensure video data is set from state
        formData.set("videoId", videoId);
        formData.set("videoUrl", videoUrl);

        // Append resources as JSON string
        formData.set("resources", JSON.stringify(resources));

        if (isEditMode && lesson) {
            formData.set("lessonId", lesson.id);
        }

        const action = isEditMode ? updateLessonAction : createLessonAction;
        const res = await action(formData);

        if (res?.error) {
            setError(res.error);
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="grid lg:grid-cols-2 gap-6">
            {error && (
                <div className="lg:col-span-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {error}
                </div>
            )}

            {/* Left Column - Lesson Info */}
            <div className="space-y-6">
                <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 p-6 space-y-5">
                    <h2 className="text-xl font-bold text-white">Thông Tin Bài Học</h2>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tiêu Đề <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            defaultValue={lesson?.title}
                            placeholder="VD: Cài đặt môi trường React"
                            className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Slug <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="slug"
                            required
                            defaultValue={lesson?.slug}
                            placeholder="cai-dat-moi-truong-react"
                            className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <p className="text-gray-500 text-sm mt-1">Viết thường, không dấu</p>
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Thứ Tự <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            name="order"
                            required
                            min="1"
                            defaultValue={lesson?.order || 1}
                            className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mô Tả Ngắn
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={lesson?.description || ""}
                            placeholder="Mô tả ngắn gọn về nội dung bài học..."
                            className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                        />
                    </div>

                    {/* Free Checkbox */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isFree"
                                defaultChecked={lesson?.isFree}
                                className="mt-1 w-5 h-5 rounded border-gray-700 bg-[#111118] text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium block">Bài học miễn phí</span>
                                <span className="text-gray-400 text-sm">Cho phép xem trước không cần đăng ký</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Nội Dung (Markdown)</h2>
                    <textarea
                        name="content"
                        rows={12}
                        required
                        defaultValue={lesson?.content || ""}
                        placeholder="# Nội dung bài học&#10;&#10;Viết nội dung bằng Markdown...&#10;&#10;## Code Example&#10;```javascript&#10;console.log('Hello');&#10;```"
                        className="w-full px-4 py-3 bg-[#111118] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm transition-colors"
                    />
                </div>
            </div>

            {/* Right Column - Video Upload & Resources */}
            <div className="space-y-6">
                <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Video Bài Học</h2>

                    {/* Hidden inputs as fallback/visual */}
                    <input type="hidden" name="videoId" value={videoId} />
                    <input type="hidden" name="videoUrl" value={videoUrl} />

                    <VideoUploaderClient 
                         initialVideoUrl={videoUrl || undefined}
                         onUploadSuccess={(id, url) => {
                             setVideoId(id);
                             setVideoUrl(url);
                         }}
                    />
                </div>

                {/* Resources Config */}
                <div className="bg-[#1f1f2e] rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Tài Liệu Tham Khảo</h2>
                        <button 
                            type="button" 
                            onClick={addResource}
                            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 p-2 rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {resources.map((res, idx) => (
                            <div key={idx} className="flex gap-2 p-3 bg-[#111118] rounded-lg border border-gray-700">
                                <div className="flex-1 space-y-2">
                                    <input 
                                        type="text" 
                                        placeholder="Tiêu đề tài liệu (VD: Source Code)"
                                        value={res.title}
                                        onChange={(e) => updateResource(idx, "title", e.target.value)}
                                        className="w-full bg-transparent text-sm text-white focus:outline-none border-b border-gray-700 pb-1"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Link (URL)"
                                        value={res.url}
                                        onChange={(e) => updateResource(idx, "url", e.target.value)}
                                        className="w-full bg-transparent text-sm text-blue-400 focus:outline-none"
                                    />
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => removeResource(idx)}
                                    className="text-gray-500 hover:text-red-400 transition-colors px-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        
                        {resources.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">Chưa có tài liệu nào.</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transform"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isEditMode ? (
                            <Save className="w-5 h-5" />
                        ) : (
                            <Plus className="w-5 h-5" />
                        )}
                        {isSubmitting ? "Đang xử lý..." : isEditMode ? "Lưu Thay Đổi" : "Tạo Bài Học"}
                    </button>
                    <Link
                        href={`/admin/courses/${courseSlug}`}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Hủy
                    </Link>
                </div>
            </div>
        </form>
    );
}
