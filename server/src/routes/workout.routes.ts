import { Router } from 'express';
import * as workoutController from '../controllers/workout.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { aiRateLimiter } from '../middleware/rateLimit';
import {
  generateWorkoutSchema,
  createWorkoutLogSchema,
  paginationSchema,
} from '../validators/workout.validator';

const router = Router();

router.use(authenticate);

router.post('/generate', aiRateLimiter, validate(generateWorkoutSchema), workoutController.generatePlan);
router.get('/plans', validate(paginationSchema, 'query'), workoutController.listPlans);
router.post('/logs', validate(createWorkoutLogSchema), workoutController.createLog);
router.get('/logs', validate(paginationSchema, 'query'), workoutController.listLogs);

export default router;
