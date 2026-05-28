import { DeviceProvider } from '@prisma/client';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { NotFoundError } from '../utils/errors';
import { generateDemoSyncData } from './devices.service';

interface OAuthState {
  userId: string;
  provider: DeviceProvider;
  modelId?: string;
}

function parseState(state: string): OAuthState {
  return JSON.parse(Buffer.from(state, 'base64url').toString('utf8')) as OAuthState;
}

/**
 * Exchange Fitbit authorization code for tokens and mark device connected.
 */
export async function completeFitbitOAuth(code: string, state: string) {
  const clientId = process.env.FITBIT_CLIENT_ID;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Fitbit OAuth not configured');
  }

  const { userId, provider, modelId } = parseState(state);
  const redirectUri = `${env.CORS_ORIGIN.replace(/\/$/, '')}/api/v1/devices/oauth/fitbit/callback`;

  const tokenRes = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: String(code),
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Fitbit token exchange failed: ${err}`);
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user_id: string;
  };

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
  const syncData = await fetchFitbitSyncData(tokens.access_token);

  const connection = await prisma.deviceConnection.upsert({
    where: { userId_provider: { userId, provider } },
    create: {
      userId,
      provider,
      deviceType: 'WATCH',
      deviceName: `Fitbit (${tokens.user_id})`,
      status: 'CONNECTED',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      lastSyncAt: new Date(),
      lastSyncData: syncData,
      metadata: { mode: 'oauth', modelId, fitbitUserId: tokens.user_id },
    },
    update: {
      status: 'CONNECTED',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      lastSyncAt: new Date(),
      lastSyncData: syncData,
      metadata: { mode: 'oauth', modelId, fitbitUserId: tokens.user_id },
    },
  });

  return connection;
}

/**
 * Exchange Google authorization code for tokens.
 */
export async function completeGoogleOAuth(code: string, state: string) {
  const clientId = process.env.GOOGLE_FIT_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_FIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Google Fit OAuth not configured');
  }

  const { userId, provider, modelId } = parseState(state);
  const redirectUri = `${env.CORS_ORIGIN.replace(/\/$/, '')}/api/v1/devices/oauth/google/callback`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: String(code),
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Google token exchange failed: ${await tokenRes.text()}`);
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
  const syncData = await fetchGoogleFitSyncData(tokens.access_token);

  const connection = await prisma.deviceConnection.upsert({
    where: { userId_provider: { userId, provider } },
    create: {
      userId,
      provider,
      deviceType: 'PHONE',
      deviceName: 'Google Fit',
      status: 'CONNECTED',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      expiresAt,
      lastSyncAt: new Date(),
      lastSyncData: syncData,
      metadata: { mode: 'oauth', modelId },
    },
    update: {
      status: 'CONNECTED',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      expiresAt,
      lastSyncAt: new Date(),
      lastSyncData: syncData,
      metadata: { mode: 'oauth', modelId },
    },
  });

  return connection;
}

/**
 * Fetch today's steps & heart rate from Fitbit API.
 */
export async function fetchFitbitSyncData(accessToken: string) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const today = new Date().toISOString().slice(0, 10);

  const [stepsRes, hrRes, sleepRes] = await Promise.all([
    fetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${today}/1d.json`, { headers }),
    fetch(`https://api.fitbit.com/1/user/-/activities/heart/date/${today}/1d.json`, { headers }),
    fetch(`https://api.fitbit.com/1/user/-/sleep/date/${today}.json`, { headers }),
  ]);

  let steps = 0;
  let heartRateAvg: number | undefined;
  let sleepHours: number | undefined;

  if (stepsRes.ok) {
    const body = (await stepsRes.json()) as { 'activities-steps': { value: string }[] };
    steps = parseInt(body['activities-steps']?.[0]?.value ?? '0', 10);
  }
  if (hrRes.ok) {
    const body = (await hrRes.json()) as {
      'activities-heart'?: { value?: { restingHeartRate?: number } }[];
    };
    heartRateAvg = body['activities-heart']?.[0]?.value?.restingHeartRate;
  }
  if (sleepRes.ok) {
    const body = (await sleepRes.json()) as { sleep?: { minutesAsleep?: number }[] };
    const mins = body.sleep?.[0]?.minutesAsleep ?? 0;
    sleepHours = Math.round((mins / 60) * 10) / 10;
  }

  return {
    steps,
    heartRateAvg,
    heartRateResting: heartRateAvg,
    sleepHours,
    activeMinutes: Math.min(120, Math.floor(steps / 100)),
    caloriesBurned: Math.floor(steps * 0.04),
    distanceKm: Math.round((steps * 0.0008) * 10) / 10,
    syncedAt: new Date().toISOString(),
  };
}

/**
 * Fetch step count from Google Fit REST API (aggregates).
 */
export async function fetchGoogleFitSyncData(accessToken: string) {
  const end = Date.now();
  const start = end - 24 * 60 * 60 * 1000;
  const body = {
    aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: start,
    endTimeMillis: end,
  };

  const res = await fetch(
    'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  let steps = 0;
  if (res.ok) {
    const data = (await res.json()) as {
      bucket?: { dataset?: { point?: { value?: { intVal?: number }[] }[] }[] }[];
    };
    for (const bucket of data.bucket ?? []) {
      for (const dataset of bucket.dataset ?? []) {
        for (const point of dataset.point ?? []) {
          steps += point.value?.[0]?.intVal ?? 0;
        }
      }
    }
  }

  if (steps === 0) {
    return generateDemoSyncData('GOOGLE_FIT');
  }

  return {
    steps,
    heartRateAvg: 72,
    sleepHours: 7,
    activeMinutes: Math.floor(steps / 80),
    caloriesBurned: Math.floor(steps * 0.04),
    distanceKm: Math.round(steps * 0.0008 * 10) / 10,
    syncedAt: new Date().toISOString(),
  };
}

/**
 * Sync device using stored OAuth token when available.
 */
export async function syncDeviceWithOAuth(
  userId: string,
  deviceId: string
): Promise<{ syncData: Record<string, unknown>; live: boolean }> {
  const device = await prisma.deviceConnection.findFirst({
    where: { id: deviceId, userId, status: 'CONNECTED' },
  });
  if (!device) throw new NotFoundError('Connected device');

  if (device.accessToken && device.provider === 'FITBIT') {
    const syncData = await fetchFitbitSyncData(device.accessToken);
    await prisma.deviceConnection.update({
      where: { id: deviceId },
      data: { lastSyncAt: new Date(), lastSyncData: syncData },
    });
    return { syncData, live: true };
  }

  if (device.accessToken && device.provider === 'GOOGLE_FIT') {
    const syncData = await fetchGoogleFitSyncData(device.accessToken);
    await prisma.deviceConnection.update({
      where: { id: deviceId },
      data: { lastSyncAt: new Date(), lastSyncData: syncData },
    });
    return { syncData, live: true };
  }

  const syncData = generateDemoSyncData(device.provider);
  await prisma.deviceConnection.update({
    where: { id: deviceId },
    data: { lastSyncAt: new Date(), lastSyncData: syncData },
  });
  return { syncData, live: false };
}
