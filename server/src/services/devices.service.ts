import { DeviceProvider, DeviceStatus, DeviceType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { NotFoundError } from '../utils/errors';

const PROVIDER_META: Record<
  DeviceProvider,
  { deviceType: DeviceType; defaultName: string }
> = {
  HEALTH_CONNECT: { deviceType: 'PHONE', defaultName: 'Android Phone' },
  GOOGLE_FIT: { deviceType: 'PHONE', defaultName: 'Google Fit' },
  FITBIT: { deviceType: 'WATCH', defaultName: 'Fitbit' },
  GARMIN: { deviceType: 'WATCH', defaultName: 'Garmin Watch' },
  SAMSUNG_HEALTH: { deviceType: 'WATCH', defaultName: 'Galaxy Watch' },
  APPLE_HEALTH: { deviceType: 'WATCH', defaultName: 'Apple Watch' },
  BLUETOOTH: { deviceType: 'WATCH', defaultName: 'Bluetooth Device' },
};

/**
 * Build OAuth URL when client credentials exist; otherwise demo connect.
 */
function getOAuthUrl(
  provider: DeviceProvider,
  userId: string,
  modelId?: string
): string | null {
  const base = env.CORS_ORIGIN.replace(/\/$/, '');
  const state = Buffer.from(JSON.stringify({ userId, provider, modelId })).toString('base64url');

  if (provider === 'FITBIT' && process.env.FITBIT_CLIENT_ID) {
    return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${base}/api/v1/devices/oauth/fitbit/callback`)}&scope=activity%20heartrate%20sleep&state=${state}`;
  }
  if (provider === 'GOOGLE_FIT' && process.env.GOOGLE_FIT_CLIENT_ID) {
    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_FIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${base}/api/v1/devices/oauth/google/callback`)}&scope=https://www.googleapis.com/auth/fitness.activity.read%20https://www.googleapis.com/auth/fitness.sleep.read&state=${state}`;
  }
  return null;
}

/**
 * Generate realistic demo sync payload for connected devices.
 */
export function generateDemoSyncData(provider: DeviceProvider) {
  const base = {
    steps: 3500 + Math.floor(Math.random() * 5000),
    heartRateAvg: 72 + Math.floor(Math.random() * 25),
    heartRateResting: 62 + Math.floor(Math.random() * 12),
    sleepHours: 6 + Math.random() * 2.5,
    activeMinutes: 20 + Math.floor(Math.random() * 60),
    caloriesBurned: 180 + Math.floor(Math.random() * 400),
    distanceKm: Math.round((3 + Math.random() * 5) * 10) / 10,
    syncedAt: new Date().toISOString(),
  };
  if (provider === 'FITBIT' || provider === 'GARMIN') {
    return { ...base, bloodOxygen: 95 + Math.floor(Math.random() * 4) };
  }
  return base;
}

/**
 * List all device connections for a user.
 */
export async function listDevices(userId: string) {
  return prisma.deviceConnection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

/**
 * Start connect flow — OAuth URL or immediate demo connection.
 */
export async function connectDevice(
  userId: string,
  provider: DeviceProvider,
  options?: { deviceName?: string; modelId?: string; imageUrl?: string; nativeConfirmed?: boolean }
) {
  const meta = PROVIDER_META[provider];
  const oauthUrl = getOAuthUrl(provider, userId, options?.modelId);
  const isNativeOnly =
    provider === 'APPLE_HEALTH' || provider === 'HEALTH_CONNECT' || provider === 'SAMSUNG_HEALTH' || provider === 'GARMIN';

  const needsOAuthConfirm = !!oauthUrl;
  const needsNativeConfirm = isNativeOnly && !options?.nativeConfirmed;

  const status = needsOAuthConfirm || needsNativeConfirm ? 'PENDING' : 'CONNECTED';
  const mode = needsOAuthConfirm ? 'oauth' : needsNativeConfirm ? 'native' : oauthUrl ? 'oauth' : 'demo';

  const connection = await prisma.deviceConnection.upsert({
    where: { userId_provider: { userId, provider } },
    create: {
      userId,
      provider,
      deviceType: meta.deviceType,
      deviceName: options?.deviceName ?? meta.defaultName,
      status,
      metadata: {
        mode,
        modelId: options?.modelId,
        imageUrl: options?.imageUrl,
      },
    },
    update: {
      deviceName: options?.deviceName ?? meta.defaultName,
      status,
      metadata: {
        mode,
        modelId: options?.modelId,
        imageUrl: options?.imageUrl,
      },
      updatedAt: new Date(),
    },
  });

  if (status === 'CONNECTED') {
    const syncData = generateDemoSyncData(provider);
    await prisma.deviceConnection.update({
      where: { id: connection.id },
      data: { lastSyncAt: new Date(), lastSyncData: syncData },
    });
  }

  return {
    connection,
    oauthUrl,
    demoMode: mode === 'demo',
    connectionMode: mode as 'oauth' | 'demo' | 'native',
    needsOAuth: needsOAuthConfirm,
    needsNativeConfirm,
  };
}

/**
 * Confirm native phone/watch link (Health Connect, Apple Health, etc.)
 */
export async function confirmNativeDevice(userId: string, deviceId: string) {
  const device = await prisma.deviceConnection.findFirst({
    where: { id: deviceId, userId },
  });
  if (!device) throw new NotFoundError('Device');

  const syncData = generateDemoSyncData(device.provider);
  return prisma.deviceConnection.update({
    where: { id: deviceId },
    data: {
      status: 'CONNECTED',
      lastSyncAt: new Date(),
      lastSyncData: syncData,
      metadata: {
        ...(typeof device.metadata === 'object' && device.metadata ? device.metadata : {}),
        mode: 'native',
        confirmedAt: new Date().toISOString(),
      },
    },
  });
}

/**
 * Disconnect a device.
 */
export async function disconnectDevice(userId: string, deviceId: string) {
  const device = await prisma.deviceConnection.findFirst({
    where: { id: deviceId, userId },
  });
  if (!device) throw new NotFoundError('Device');

  return prisma.deviceConnection.update({
    where: { id: deviceId },
    data: {
      status: 'DISCONNECTED',
      accessToken: null,
      refreshToken: null,
      lastSyncData: undefined,
    },
  });
}

/**
 * Sync data from connected wearable (demo or future OAuth APIs).
 */
export async function syncDevice(userId: string, deviceId: string) {
  const device = await prisma.deviceConnection.findFirst({
    where: { id: deviceId, userId, status: 'CONNECTED' },
  });
  if (!device) throw new NotFoundError('Connected device');

  if (device.provider === 'BLUETOOTH') {
    return {
      device,
      syncData: device.lastSyncData,
      live: true,
      bluetooth: true,
    };
  }

  const { syncDeviceWithOAuth } = await import('./devices.oauth');
  const { syncData, live } = await syncDeviceWithOAuth(userId, deviceId);
  const updated = await prisma.deviceConnection.findUnique({ where: { id: deviceId } });
  return { device: updated, syncData, live };
}

export interface BluetoothRegisterInput {
  deviceName: string;
  bleDeviceId: string;
  bleServices?: string[];
  syncData?: Record<string, unknown>;
  batteryPercent?: number;
}

/**
 * Register a Web Bluetooth connection (live BLE from browser).
 */
export async function registerBluetoothDevice(userId: string, input: BluetoothRegisterInput) {
  const syncData = input.syncData ?? {
    steps: 0,
    heartRateAvg: undefined,
    syncedAt: new Date().toISOString(),
  };

  const connection = await prisma.deviceConnection.upsert({
    where: { userId_provider: { userId, provider: 'BLUETOOTH' } },
    create: {
      userId,
      provider: 'BLUETOOTH',
      deviceType: 'WATCH',
      deviceName: input.deviceName,
      status: 'CONNECTED',
      lastSyncAt: new Date(),
      lastSyncData: syncData as Prisma.InputJsonValue,
      metadata: {
        mode: 'bluetooth',
        bleDeviceId: input.bleDeviceId,
        bleServices: input.bleServices ?? [],
        batteryPercent: input.batteryPercent,
        imageUrl: '/devices/watch-sport.jpg',
      } as Prisma.InputJsonValue,
    },
    update: {
      deviceName: input.deviceName,
      status: 'CONNECTED',
      lastSyncAt: new Date(),
      lastSyncData: syncData as Prisma.InputJsonValue,
      metadata: {
        mode: 'bluetooth',
        bleDeviceId: input.bleDeviceId,
        bleServices: input.bleServices ?? [],
        batteryPercent: input.batteryPercent,
        imageUrl: '/devices/watch-sport.jpg',
      } as Prisma.InputJsonValue,
    },
  });

  return connection;
}

/**
 * Push live readings from an active Web Bluetooth session.
 */
export async function pushBluetoothSync(
  userId: string,
  deviceId: string,
  syncData: Record<string, unknown>,
  extra?: { batteryPercent?: number }
) {
  const device = await prisma.deviceConnection.findFirst({
    where: { id: deviceId, userId, provider: 'BLUETOOTH' },
  });
  if (!device) throw new NotFoundError('Bluetooth device');

  const meta =
    typeof device.metadata === 'object' && device.metadata
      ? (device.metadata as Record<string, unknown>)
      : {};

  return prisma.deviceConnection.update({
    where: { id: deviceId },
    data: {
      lastSyncAt: new Date(),
      lastSyncData: syncData as Prisma.InputJsonValue,
      status: 'CONNECTED',
      metadata: {
        ...meta,
        mode: 'bluetooth',
        batteryPercent: extra?.batteryPercent ?? (meta.batteryPercent as number | undefined),
      } as Prisma.InputJsonValue,
    },
  });
}

/**
 * Sync all connected devices for a user.
 */
export async function syncAllDevices(userId: string) {
  const devices = await prisma.deviceConnection.findMany({
    where: { userId, status: 'CONNECTED' },
  });
  const results = await Promise.all(
    devices.map((d) => syncDevice(userId, d.id))
  );
  return results;
}
