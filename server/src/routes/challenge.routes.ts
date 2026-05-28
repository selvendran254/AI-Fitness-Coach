import { Router } from 'express';
import * as challengeController from '../controllers/challenge.controller';
import * as features from '../controllers/features.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', challengeController.listChallenges);
router.get('/leaderboard', challengeController.leaderboard);
router.post('/', features.createChallenge);
router.post('/:id/join', features.joinChallenge);
router.patch('/:id/progress', features.updateChallengeProgress);

export default router;
