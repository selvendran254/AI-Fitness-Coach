import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import workoutRoutes from './workout.routes';
import nutritionRoutes from './nutrition.routes';
import aiRoutes from './ai.routes';
import progressRoutes from './progress.routes';
import challengeRoutes from './challenge.routes';
import adminRoutes from './admin.routes';
import devicesRoutes from './devices.routes';
import featuresRoutes from './features.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workouts', workoutRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/ai', aiRoutes);
router.use('/progress', progressRoutes);
router.use('/challenges', challengeRoutes);
router.use('/admin', adminRoutes);
router.use('/devices', devicesRoutes);
router.use('/', featuresRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

export default router;
