import { PrismaClient, Role, PlanType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { courses } from '../src/lib/courses';
import { products } from '../src/lib/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Start seeding ...');

  // 1. Seed Admin User
  const adminEmail = 'admin@hoclaptrinhcungdung.com';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Created Admin user: ${admin.email}`);

  // 2. Seed Courses
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
        price: 0,
        lessons: {
          create: course.lessons.map((lesson, index) => ({
            title: lesson.title,
            slug: lesson.slug,
            order: index, // Changed from position to order
            content: `Nội dung demo cho bài học **${lesson.title}**. \n\n## Giới thiệu\n\nĐây là nội dung được tạo tự động từ seed script.`,
          })),
        },
      },
    });
    console.log(`📘 Created course: ${createdCourse.title}`);
  }

  // 3. Seed Products (Source Code)
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
          create: product.reviews && product.reviews.length > 0 ? [{
            user: product.reviews[0].user,
            avatar: product.reviews[0].avatar,
            rating: product.reviews[0].rating,
            content: product.reviews[0].content,
            date: product.reviews[0].date,
            userId: admin.id // Link to admin for seed data
          }] : []
        }
      },
    });
    console.log(`📦 Created product: ${createdProduct.title}`);
  }
  
  // 4. Seed Pricing Plans
  const plansData = [
    {
      name: "Standard Access",
      description: "Thanh toán linh hoạt, truy cập đầy đủ nội dung.",
      type: PlanType.SUBSCRIPTION,
      priceMonthly: 199,
      priceYearly: 1690,
      features: [
        "Truy cập toàn bộ khóa học PRO",
        "Source code dự án thực tế",
        "Xem video 4K không quảng cáo",
        "Tham gia cộng đồng Discord VIP"
      ],
      order: 1,
      isBestChoice: false
    },
    {
      name: "VIP Lifetime",
      description: "Đầu tư một lần, sở hữu mãi mãi với nhiều đặc quyền.",
      type: PlanType.LIFETIME,
      priceLifetime: 3990,
      specialFeature: "Mentor hỗ trợ 1:1, Review CV & Portfolio, Tư vấn lộ trình thăng tiến.",
      features: [
        "Tất cả quyền lợi gói Standard",
        "Không bao giờ phải gia hạn",
        "Ưu tiên hỗ trợ 24/7 (Priority)",
        "Quà tặng: Áo thun & Sticker Dev",
        "Chứng nhận hoàn thành (Hard Copy)"
      ],
      order: 2,
      isBestChoice: true
    }
  ];

  for (const plan of plansData) {
    const existing = await prisma.pricingPlan.findFirst({
      where: { name: plan.name }
    });
    
    if (existing) {
      await prisma.pricingPlan.update({
        where: { id: existing.id },
        data: plan
      });
    } else {
      await prisma.pricingPlan.create({
        data: plan
      });
    }
    console.log(`💳 Created plan: ${plan.name}`);
  }

  console.log('✨ Seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
