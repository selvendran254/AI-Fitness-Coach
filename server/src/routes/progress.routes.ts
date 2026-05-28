import { Router } from 'express';
import * as progressController from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/entries', progressController.createEntry);
router.get('/entries', progressController.listEntries);
router.post('/sleep', progressController.logSleep);

export default router;
