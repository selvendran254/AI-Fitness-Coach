import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as f from '../controllers/features.controller';

const router = Router();
router.use(authenticate);

router.get('/dashboard/summary', f.dashboardSummary);
router.get('/notifications', f.listNotifications);
router.post('/notifications/push-subscribe', f.subscribePush);
router.post('/medications/log', f.logMed);
router.get('/medications/logs', f.listMeds);
router.post('/medications/check-reminders', f.medRemindersCheck);
router.post('/caregiver/invite', f.inviteCaregiver);
router.get('/caregiver/patients', f.caregiverPatients);
router.get('/caregiver/patient/:patientId', f.caregiverView);
router.get('/reports/doctor', f.doctorReport);
router.post('/pairing/qr', f.pairingQr);
router.post('/ai/weekly-summary', f.weeklySummary);
router.get('/streaks', f.getStreaks);
router.post('/workouts/safety-check', f.workoutSafety);
router.post('/onboarding/complete', f.completeOnboarding);

export default router;
