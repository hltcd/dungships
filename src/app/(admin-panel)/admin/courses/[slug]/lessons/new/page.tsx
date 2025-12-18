import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LessonForm from "@/components/admin/LessonForm";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function NewLessonPage(props: Props) {
    const params = await props.params;
    const { slug } = params;

    const course = await prisma.course.findUnique({
        where: { slug },
        select: { id: true, title: true, slug: true },
    });

    if (!course) {
        redirect("/admin/courses");
    }

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="text-3xl font-black text-white">Thêm Bài Học Mới</h1>
                <p className="text-gray-400 mt-1">
                    Khóa học: <span className="text-blue-400">{course.title}</span>
                </p>
            </div>

            <LessonForm courseId={course.id} courseSlug={course.slug} />
        </div>
    );
}
