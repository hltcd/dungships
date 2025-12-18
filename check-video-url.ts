const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    select: {
      id: true,
      title: true,
      videoUrl: true,
      videoId: true
    }
  });

  console.log("Latest Lesson:", JSON.stringify(lessons, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
