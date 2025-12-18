import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LessonForm from "@/components/admin/LessonForm";

interface Props {
    params: Promise<{ slug: string; lessonId: string }>;
}

export default async function EditLessonPage(props: Props) {
    const params = await props.params;
    const { slug, lessonId } = params;

    const course = await prisma.course.findUnique({
        where: { slug },
        select: { id: true, title: true, slug: true },
    });

    if (!course) {
        redirect("/admin/courses");
    }

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
    });

    if (!lesson) {
        redirect(`/admin/courses/${slug}`);
    }

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="text-3xl font-black text-white">Chỉnh Sửa Bài Học</h1>
                <p className="text-gray-400 mt-1">
                    Khóa học: <span className="text-blue-400">{course.title}</span> • Bài: <span className="text-white">{lesson.title}</span>
                </p>
            </div>

            <LessonForm 
                courseId={course.id} 
                courseSlug={course.slug}
                lesson={lesson}
                isEditMode={true}
            />
        </div>
    );
}
