import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/stats', adminController.getStats);

export default router;
