import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema, updateSettingsSchema } from '../validators/settings.validator';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getProfile);
router.patch('/me', validate(updateProfileSchema), userController.updateProfile);
router.get('/me/settings', userController.getSettings);
router.patch('/me/settings', validate(updateSettingsSchema), userController.updateSettings);

export default router;
