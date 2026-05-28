"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const shared_1 = require("@ai-fitness-coach/shared");
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcryptjs_1.default.hash('Demo@12345', 12);
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
            settings: { create: { preferences: shared_1.DEFAULT_USER_SETTINGS } },
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
                        ...shared_1.DEFAULT_USER_SETTINGS,
                        language: 'ta',
                        healthConditions: ['DIABETES_TYPE2', 'HYPERTENSION'],
                        insulinDependent: false,
                        maxDailySodiumMg: 1500,
                        maxCarbsPerMealG: 45,
                    },
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
