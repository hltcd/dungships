import { prisma } from "@/lib/prisma";
import CoursesClient from "@/components/CoursesClient";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { lessons: true, purchases: true } },
    },
  });

  return <CoursesClient courses={courses} />;
}
