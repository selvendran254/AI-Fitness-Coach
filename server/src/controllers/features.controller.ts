import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/response';
import * as dashboard from '../services/dashboard.service';
import * as notifications from '../services/notification.service';
import * as medication from '../services/medication.service';
import * as caregiver from '../services/caregiver.service';
import * as report from '../services/report.service';
import * as pairing from '../services/pairing.service';
import * as weekly from '../services/weekly.service';
import * as streaks from '../services/streak.service';
import * as safety from '../services/exerciseSafety.service';
import * as challenges from '../services/challenge.service';
import * as auth from '../services/auth.service';

export async function dashboardSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await dashboard.getDashboardSummary(req.user!.id));
  } catch (e) {
    next(e);
  }
}

export async function listNotifications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await notifications.listNotifications(req.user!.id));
  } catch (e) {
    next(e);
  }
}

export async function subscribePush(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await notifications.subscribePush(req.user!.id, req.body);
    sendSuccess(res, { ok: true });
  } catch (e) {
    next(e);
  }
}

export async function logMed(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await medication.logMedication(req.user!.id, req.body), 201);
  } catch (e) {
    next(e);
  }
}

export async function listMeds(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await medication.listMedicationLogs(req.user!.id));
  } catch (e) {
    next(e);
  }
}

export async function medRemindersCheck(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await medication.processMedicationReminders(req.user!.id));
  } catch (e) {
    next(e);
  }
}

export async function inviteCaregiver(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await caregiver.inviteCaregiver(req.user!.id, req.body.caregiverEmail), 201);
  } catch (e) {
    next(e);
  }
}

export async function caregiverPatients(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await caregiver.listCaregiverPatients(req.user!.id));
  } catch (e) {
    next(e);
  }
}

export async function caregiverView(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(
      res,
      await caregiver.getPatientSummaryForCaregiver(req.user!.id, String(req.params.patientId))
    );
  } catch (e) {
    next(e);
  }
}

export async function doctorReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await report.buildDoctorReport(req.user!.id, req.query.days ? Number(req.query.days) : 30));
  } catch (e) {
    next(e);
  }
}

export async function pairingQr(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await pairing.createPairingToken(req.user!.id));
  } catch (e) {
    next(e);
  }
}

export async function weeklySummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const lang = (req.query.lang as 'en' | 'ta') ?? 'en';
    sendSuccess(res, await weekly.generateWeeklySummary(req.user!.id, lang));
  } catch (e) {
    next(e);
  }
}

export async function getStreaks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await streaks.computeStreaks(req.user!.id));
  } catch (e) {
    next(e);
  }
}

export async function workoutSafety(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await safety.checkWorkoutSafety(req.user!.id, req.body));
  } catch (e) {
    next(e);
  }
}

export async function createChallenge(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await challenges.createChallenge(req.user!.id, req.body), 201);
  } catch (e) {
    next(e);
  }
}

export async function joinChallenge(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await challenges.joinChallenge(req.user!.id, String(req.params.id)), 201);
  } catch (e) {
    next(e);
  }
}

export async function updateChallengeProgress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(
      res,
      await challenges.updateChallengeProgress(req.user!.id, String(req.params.id), req.body.currentValue)
    );
  } catch (e) {
    next(e);
  }
}

export async function completeOnboarding(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await auth.completeOnboarding(req.user!.id));
  } catch (e) {
    next(e);
  }
}
