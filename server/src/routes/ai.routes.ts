import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { aiRateLimiter } from '../middleware/rateLimit';
import { chatSchema } from '../validators/ai.validator';

const router = Router();

router.use(authenticate);

router.post('/chat', aiRateLimiter, validate(chatSchema), aiController.chat);
router.get('/chat/history', aiController.chatHistory);

export default router;
