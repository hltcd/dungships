
import { PrismaClient } from '@prisma/client';
import { courses } from '../src/lib/courses';
import { products } from '../src/lib/products';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed Courses
  for (const course of courses) {
    const createdCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        description: course.description,
        image: course.image,
      },
      create: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        image: course.image,
        isPublished: true,
        price: 0, // Mock data didn't have price for courses, setting default
        lessons: {
          create: course.lessons.map((lesson, index) => ({
            title: lesson.title,
            slug: lesson.slug,
            duration: lesson.duration,
            isFree: lesson.isFree,
            position: index,
            content: `Nội dung demo cho bài học **${lesson.title}**. \n\n## Giới thiệu\n\nĐây là nội dung được tạo tự động từ seed script.`,
          })),
        },
      },
    });
    console.log(`Created course with id: ${createdCourse.id}`);
  }

  // Seed Products (Source Code)
  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        description: product.description,
        price: product.price,
      },
      create: {
        title: product.title,
        slug: product.slug,
        description: product.description,
        longDescription: product.longDescription,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        features: product.features || [],
        gallery: product.gallery || [],
        tags: product.tags,
        link: product.link,
        reviews: {
            create: product.reviews?.map((review) => ({
                user: review.user,
                avatar: review.avatar,
                rating: review.rating,
                content: review.content,
                date: review.date
            }))
        }
      },
    });
    console.log(`Created product with id: ${createdProduct.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
