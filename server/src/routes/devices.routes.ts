import { Router } from 'express';
import { z } from 'zod';
import * as devicesController from '../controllers/devices.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const bluetoothRegisterSchema = z.object({
  deviceName: z.string().min(1),
  bleDeviceId: z.string().min(1),
  bleServices: z.array(z.string()).optional(),
  batteryPercent: z.number().min(0).max(100).optional(),
  syncData: z.record(z.unknown()).optional(),
});

const bluetoothPushSchema = z.object({
  syncData: z.object({
    steps: z.number().optional(),
    heartRateAvg: z.number().optional(),
    heartRateResting: z.number().optional(),
    sleepHours: z.number().optional(),
    activeMinutes: z.number().optional(),
    caloriesBurned: z.number().optional(),
    distanceKm: z.number().optional(),
    bloodOxygen: z.number().optional(),
    syncedAt: z.string(),
  }),
  batteryPercent: z.number().min(0).max(100).optional(),
});

const connectSchema = z.object({
  provider: z.enum([
    'GOOGLE_FIT',
    'FITBIT',
    'GARMIN',
    'SAMSUNG_HEALTH',
    'APPLE_HEALTH',
    'HEALTH_CONNECT',
    'BLUETOOTH',
  ]),
  deviceName: z.string().optional(),
  modelId: z.string().optional(),
  imageUrl: z.string().optional(),
  nativeConfirmed: z.boolean().optional(),
});

const router = Router();

// OAuth callbacks (no JWT — provider redirects here)
router.get('/oauth/fitbit/callback', devicesController.fitbitCallback);
router.get('/oauth/google/callback', devicesController.googleCallback);

router.use(authenticate);

router.get('/', devicesController.list);
router.get('/providers', devicesController.providers);
router.post('/connect', validate(connectSchema), devicesController.connect);
router.post('/bluetooth/register', validate(bluetoothRegisterSchema), devicesController.registerBluetooth);
router.post('/:id/bluetooth/push', validate(bluetoothPushSchema), devicesController.pushBluetooth);
router.post('/:id/confirm-native', devicesController.confirmNative);
router.post('/sync-all', devicesController.syncAll);
router.post('/:id/sync', devicesController.syncOne);
router.delete('/:id', devicesController.disconnect);

export default router;
