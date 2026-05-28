import { Request, Response, NextFunction } from 'express';
import { DeviceProvider } from '@prisma/client';
import { DEVICE_PROVIDERS } from '@ai-fitness-coach/shared';
import * as devicesService from '../services/devices.service';
import * as devicesOAuth from '../services/devices.oauth';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

/**
 * GET /devices — list connected phone/watch
 */
export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const devices = await devicesService.listDevices(req.user!.id);
    sendSuccess(res, devices);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /devices/providers — available providers info
 */
export async function providers(_req: AuthRequest, res: Response) {
  sendSuccess(res, DEVICE_PROVIDERS);
}

/**
 * POST /devices/connect — connect phone or watch
 */
export async function connect(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await devicesService.connectDevice(req.user!.id, req.body.provider as DeviceProvider, {
      deviceName: req.body.deviceName,
      modelId: req.body.modelId,
      imageUrl: req.body.imageUrl,
      nativeConfirmed: req.body.nativeConfirmed,
    });
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /devices/:id — disconnect
 */
export async function disconnect(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const device = await devicesService.disconnectDevice(req.user!.id, String(req.params.id));
    sendSuccess(res, device);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /devices/:id/sync — sync one device
 */
export async function syncOne(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await devicesService.syncDevice(req.user!.id, String(req.params.id));
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /devices/sync-all — sync all connected devices
 */
export async function syncAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const results = await devicesService.syncAllDevices(req.user!.id);
    sendSuccess(res, results);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /devices/:id/confirm-native — user confirmed Health Connect / Apple Health on phone
 */
export async function confirmNative(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const device = await devicesService.confirmNativeDevice(req.user!.id, String(req.params.id));
    sendSuccess(res, device);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /devices/oauth/fitbit/callback — Fitbit OAuth redirect (public)
 */
export async function fitbitCallback(req: Request, res: Response) {
  const origin = env.CORS_ORIGIN.replace(/\/$/, '');
  try {
    if (!req.query.code || !req.query.state) {
      res.redirect(`${origin}/devices/oauth-complete?status=error&provider=fitbit`);
      return;
    }
    await devicesOAuth.completeFitbitOAuth(String(req.query.code), String(req.query.state));
    res.redirect(`${origin}/devices/oauth-complete?status=success&provider=fitbit`);
  } catch {
    res.redirect(`${origin}/devices/oauth-complete?status=error&provider=fitbit`);
  }
}

/**
 * GET /devices/oauth/google/callback — Google Fit OAuth redirect (public)
 */
/**
 * POST /devices/bluetooth/register — save Web Bluetooth pairing from browser
 */
export async function registerBluetooth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const device = await devicesService.registerBluetoothDevice(req.user!.id, req.body);
    sendSuccess(res, device, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /devices/:id/bluetooth/push — live BLE metrics from browser
 */
export async function pushBluetooth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const device = await devicesService.pushBluetoothSync(
      req.user!.id,
      String(req.params.id),
      req.body.syncData,
      { batteryPercent: req.body.batteryPercent }
    );
    sendSuccess(res, device);
  } catch (err) {
    next(err);
  }
}

export async function googleCallback(req: Request, res: Response) {
  const origin = env.CORS_ORIGIN.replace(/\/$/, '');
  try {
    if (!req.query.code || !req.query.state) {
      res.redirect(`${origin}/devices/oauth-complete?status=error&provider=google`);
      return;
    }
    await devicesOAuth.completeGoogleOAuth(String(req.query.code), String(req.query.state));
    res.redirect(`${origin}/devices/oauth-complete?status=success&provider=google`);
  } catch {
    res.redirect(`${origin}/devices/oauth-complete?status=error&provider=google`);
  }
}
