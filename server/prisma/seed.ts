import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_USER_SETTINGS } from '@ai-fitness-coach/shared';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Demo@12345', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fitcoach.demo' },
    update: {},
    create: {
      email: 'admin@fitcoach.demo',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      healthConditions: ['NONE'],
      settings: { create: { preferences: DEFAULT_USER_SETTINGS as object } },
      goals: { create: {} },
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: 'demo@fitcoach.demo' },
    update: {},
    create: {
      email: 'demo@fitcoach.demo',
      passwordHash,
      firstName: 'ராமன்',
      lastName: 'Kumar',
      preferredLanguage: 'ta',
      healthConditions: ['DIABETES_TYPE2', 'HYPERTENSION'],
      fitnessLevel: 'BEGINNER',
      heightCm: 170,
      weightKg: 78,
      dailyCalorieGoal: 1800,
      settings: {
        create: {
          preferences: {
            ...DEFAULT_USER_SETTINGS,
            language: 'ta',
            healthConditions: ['DIABETES_TYPE2', 'HYPERTENSION'],
            insulinDependent: false,
            maxDailySodiumMg: 1500,
            maxCarbsPerMealG: 45,
          } as object,
        },
      },
      goals: {
        create: {
          primaryGoal: 'HEALTH_MANAGEMENT',
          weeklyWorkoutDays: 4,
          targetStepsPerDay: 6000,
        },
      },
    },
  });

  console.log('Seeded users:', { admin: admin.email, demo: demo.email });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
