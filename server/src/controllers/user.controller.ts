import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';
import { DEFAULT_USER_SETTINGS } from '@ai-fitness-coach/shared';
import type { UserSettings } from '@ai-fitness-coach/shared';

/**
 * GET /users/me
 */
export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { goals: true, settings: true },
      omit: { passwordHash: true },
    });
    if (!user) throw new NotFoundError('User');
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/me
 */
export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body,
      omit: { passwordHash: true },
    });
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users/me/settings
 */
export async function getSettings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: req.user!.id },
    });
    const prefs = (settings?.preferences ?? DEFAULT_USER_SETTINGS) as UserSettings;
    sendSuccess(res, {
      ...settings,
      preferences: { ...DEFAULT_USER_SETTINGS, ...prefs },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/me/settings — merge advanced preferences
 */
export async function updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const existing = await prisma.userSettings.findUnique({
      where: { userId: req.user!.id },
    });
    const currentPrefs = (existing?.preferences ?? DEFAULT_USER_SETTINGS) as Record<string, unknown>;
    const mergedPrefs = req.body.preferences
      ? { ...currentPrefs, ...req.body.preferences }
      : currentPrefs;

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user!.id },
      create: {
        userId: req.user!.id,
        preferences: mergedPrefs,
        theme: req.body.theme ?? 'system',
      },
      update: {
        preferences: mergedPrefs,
        theme: req.body.theme,
        pushNotificationsEnabled: req.body.pushNotificationsEnabled,
        offlineModeEnabled: req.body.offlineModeEnabled,
        analyticsEnabled: req.body.analyticsEnabled,
      },
    });
    sendSuccess(res, settings);
  } catch (err) {
    next(err);
  }
}
