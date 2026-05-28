import type { DeviceProvider } from '../types/device';

export interface DeviceModel {
  id: string;
  provider: DeviceProvider;
  name: string;
  nameTa: string;
  imageUrl: string;
}

/** Real device models users can pick when connecting phone or watch */
export const DEVICE_MODELS: DeviceModel[] = [
  {
    id: 'health-connect-pixel',
    provider: 'HEALTH_CONNECT',
    name: 'Android Phone (Health Connect)',
    nameTa: 'ஆண்ட்ராய்டு போன் (Health Connect)',
    imageUrl: '/devices/phone-android.jpg',
  },
  {
    id: 'google-fit-phone',
    provider: 'GOOGLE_FIT',
    name: 'Android / Google Fit',
    nameTa: 'Google Fit போன்',
    imageUrl: '/devices/phone-android.jpg',
  },
  {
    id: 'fitbit-charge-6',
    provider: 'FITBIT',
    name: 'Fitbit Charge 6',
    nameTa: 'Fitbit Charge 6',
    imageUrl: '/devices/watch-fitbit.jpg',
  },
  {
    id: 'fitbit-versa-4',
    provider: 'FITBIT',
    name: 'Fitbit Versa 4',
    nameTa: 'Fitbit Versa 4',
    imageUrl: '/devices/watch-sport.jpg',
  },
  {
    id: 'fitbit-sense-2',
    provider: 'FITBIT',
    name: 'Fitbit Sense 2',
    nameTa: 'Fitbit Sense 2',
    imageUrl: '/devices/watch-fitness.jpg',
  },
  {
    id: 'garmin-venu-3',
    provider: 'GARMIN',
    name: 'Garmin Venu 3',
    nameTa: 'Garmin Venu 3',
    imageUrl: '/devices/watch-garmin.jpg',
  },
  {
    id: 'garmin-forerunner',
    provider: 'GARMIN',
    name: 'Garmin Forerunner',
    nameTa: 'Garmin Forerunner',
    imageUrl: '/devices/watch-sport.jpg',
  },
  {
    id: 'samsung-watch-7',
    provider: 'SAMSUNG_HEALTH',
    name: 'Galaxy Watch 7',
    nameTa: 'Galaxy Watch 7',
    imageUrl: '/devices/watch-samsung.jpg',
  },
  {
    id: 'samsung-watch-6',
    provider: 'SAMSUNG_HEALTH',
    name: 'Galaxy Watch 6',
    nameTa: 'Galaxy Watch 6',
    imageUrl: '/devices/watch-samsung.jpg',
  },
  {
    id: 'apple-watch-ultra',
    provider: 'APPLE_HEALTH',
    name: 'Apple Watch Ultra 2',
    nameTa: 'Apple Watch Ultra 2',
    imageUrl: '/devices/watch-apple.jpg',
  },
  {
    id: 'apple-watch-series',
    provider: 'APPLE_HEALTH',
    name: 'Apple Watch Series 9',
    nameTa: 'Apple Watch Series 9',
    imageUrl: '/devices/watch-apple.jpg',
  },
  {
    id: 'apple-iphone-health',
    provider: 'APPLE_HEALTH',
    name: 'iPhone (Apple Health)',
    nameTa: 'iPhone (Apple Health)',
    imageUrl: '/devices/phone-android.jpg',
  },
];

export function getModelsForProvider(provider: DeviceProvider): DeviceModel[] {
  return DEVICE_MODELS.filter((m) => m.provider === provider);
}

export function getModelById(id: string): DeviceModel | undefined {
  return DEVICE_MODELS.find((m) => m.id === id);
}
