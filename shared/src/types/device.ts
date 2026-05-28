export type DeviceProvider =
  | 'GOOGLE_FIT'
  | 'FITBIT'
  | 'GARMIN'
  | 'SAMSUNG_HEALTH'
  | 'APPLE_HEALTH'
  | 'HEALTH_CONNECT'
  | 'BLUETOOTH';

export type DeviceType = 'PHONE' | 'WATCH';

export type DeviceStatus = 'DISCONNECTED' | 'PENDING' | 'CONNECTED' | 'ERROR';

export interface WearableSyncData {
  steps: number;
  heartRateAvg?: number;
  heartRateResting?: number;
  sleepHours?: number;
  activeMinutes?: number;
  caloriesBurned?: number;
  distanceKm?: number;
  bloodOxygen?: number;
  syncedAt: string;
}

export interface DeviceConnection {
  id: string;
  provider: DeviceProvider;
  deviceType: DeviceType;
  deviceName?: string | null;
  status: DeviceStatus;
  lastSyncAt?: string | null;
  lastSyncData?: WearableSyncData | null;
  metadata?: {
    mode?: 'oauth' | 'demo' | 'native' | 'bluetooth';
    modelId?: string;
    imageUrl?: string;
    confirmedAt?: string;
    bleDeviceId?: string;
    bleServices?: string[];
    batteryPercent?: number;
  } | null;
}

export interface DeviceProviderInfo {
  id: DeviceProvider;
  name: string;
  nameTa: string;
  deviceType: DeviceType;
  description: string;
  descriptionTa: string;
  icon: string;
  /** Product photo shown in connect UI */
  imageUrl: string;
  brandColor: string;
  supports: string[];
  oauthAvailable: boolean;
}

export const DEVICE_PROVIDERS: DeviceProviderInfo[] = [
  {
    id: 'HEALTH_CONNECT',
    name: 'Android Phone (Health Connect)',
    nameTa: 'ஆண்ட்ராய்டு போன் (Health Connect)',
    deviceType: 'PHONE',
    description: 'Sync steps, heart rate & sleep from your Android phone',
    descriptionTa: 'உங்கள் ஆண்ட்ராய்டு போனிலிருந்து படிகள், இதயம், தூக்கம்',
    icon: 'smartphone',
    imageUrl: '/devices/phone-android.jpg',
    brandColor: '#34A853',
    supports: ['steps', 'heart_rate', 'sleep', 'calories'],
    oauthAvailable: true,
  },
  {
    id: 'GOOGLE_FIT',
    name: 'Google Fit',
    nameTa: 'Google Fit',
    deviceType: 'PHONE',
    description: 'Connect phone — syncs with many watches automatically',
    descriptionTa: 'போன் இணைப்பு — பல வாட்ச்களுடன் தானாக ஒத்திசைவு',
    icon: 'google',
    imageUrl: '/devices/phone-android.jpg',
    brandColor: '#4285F4',
    supports: ['steps', 'heart_rate', 'sleep', 'workouts'],
    oauthAvailable: true,
  },
  {
    id: 'FITBIT',
    name: 'Fitbit Watch / Tracker',
    nameTa: 'Fitbit வாட்ச்',
    deviceType: 'WATCH',
    description: 'Fitbit, Versa, Charge, Sense series',
    descriptionTa: 'Fitbit வாட்ச் மற்றும் டிராக்கர்',
    icon: 'watch',
    imageUrl: '/devices/watch-fitbit.jpg',
    brandColor: '#00B0B9',
    supports: ['steps', 'heart_rate', 'sleep', 'spo2'],
    oauthAvailable: true,
  },
  {
    id: 'GARMIN',
    name: 'Garmin Watch',
    nameTa: 'Garmin வாட்ச்',
    deviceType: 'WATCH',
    description: 'Forerunner, Fenix, Venu, Lily series',
    descriptionTa: 'Garmin விளையாட்டு & ஃபிட்னஸ் வாட்ச்',
    icon: 'watch',
    imageUrl: '/devices/watch-garmin.jpg',
    brandColor: '#000000',
    supports: ['steps', 'heart_rate', 'sleep', 'stress'],
    oauthAvailable: true,
  },
  {
    id: 'SAMSUNG_HEALTH',
    name: 'Samsung Galaxy Watch',
    nameTa: 'Samsung Galaxy Watch',
    deviceType: 'WATCH',
    description: 'Galaxy Watch 4/5/6/7 + Samsung Health app',
    descriptionTa: 'Galaxy Watch + Samsung Health',
    icon: 'watch',
    imageUrl: '/devices/watch-samsung.jpg',
    brandColor: '#1428A0',
    supports: ['steps', 'heart_rate', 'sleep', 'bp'],
    oauthAvailable: true,
  },
  {
    id: 'APPLE_HEALTH',
    name: 'Apple Watch / iPhone',
    nameTa: 'Apple Watch / iPhone',
    deviceType: 'WATCH',
    description: 'Apple Health — install PWA on iPhone for best sync',
    descriptionTa: 'Apple Health — iPhone-ல் PWA install செய்யுங்கள்',
    icon: 'apple',
    imageUrl: '/devices/watch-apple.jpg',
    brandColor: '#000000',
    supports: ['steps', 'heart_rate', 'sleep', 'ecg'],
    oauthAvailable: false,
  },
  {
    id: 'BLUETOOTH',
    name: 'Bluetooth Watch / Band',
    nameTa: 'ப்ளூடூத் வாட்ச் / பேண்ட்',
    deviceType: 'WATCH',
    description: 'Direct BLE link — heart rate live (Chrome/Edge, HTTPS or localhost)',
    descriptionTa: 'நேரடி Bluetooth — இதய துடிப்பு live (Chrome பரிந்துரைக்கப்படுகிறது)',
    icon: 'bluetooth',
    imageUrl: '/devices/watch-sport.jpg',
    brandColor: '#2563EB',
    supports: ['heart_rate', 'battery', 'live_ble'],
    oauthAvailable: false,
  },
];
