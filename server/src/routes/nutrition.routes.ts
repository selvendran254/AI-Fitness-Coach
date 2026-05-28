import { Router } from 'express';
import * as nutritionController from '../controllers/nutrition.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { aiRateLimiter } from '../middleware/rateLimit';
import {
  createMealSchema,
  analyzeFoodSchema,
  generateMealPlanSchema,
  waterLogSchema,
} from '../validators/nutrition.validator';
import { paginationSchema } from '../validators/workout.validator';

const router = Router();

router.use(authenticate);

router.post('/meals/analyze', aiRateLimiter, validate(analyzeFoodSchema), nutritionController.analyzeFood);
router.post('/meals', validate(createMealSchema), nutritionController.createMeal);
router.get('/meals', validate(paginationSchema, 'query'), nutritionController.listMeals);
router.post('/meal-plans/generate', aiRateLimiter, validate(generateMealPlanSchema), nutritionController.generateMealPlan);
router.post('/water', validate(waterLogSchema), nutritionController.logWater);

export default router;
