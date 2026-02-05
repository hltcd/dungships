import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "test-pro@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 1. Create User
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "PRO",
      proExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      password: hashedPassword
    },
    create: {
      email,
      name: "Test Pro User",
      role: "PRO",
      proExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      password: hashedPassword
    }
  });

  console.log(`User created/updated: ${user.email}`);

  // 2. Find "Standard Access" Plan
  const plan = await prisma.pricingPlan.findFirst({
    where: { name: "Standard Access" }
  });

  if (plan) {
    // 3. Create Purchase for the plan
    await prisma.purchase.upsert({
      where: {
        userId_planId: {
          userId: user.id,
          planId: plan.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        planId: plan.id
      }
    });
    console.log(`Linked user to plan: ${plan.name}`);
  } else {
    console.error("Standard Access plan not found!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
