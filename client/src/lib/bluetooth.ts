/**
 * Web Bluetooth — scan nearby devices & connect (Chrome/Edge, localhost or HTTPS).
 */

const HR_SERVICE = 'heart_rate' as BluetoothServiceUUID;
const HR_MEASUREMENT = 'heart_rate_measurement' as BluetoothCharacteristicUUID;
const BATTERY_SERVICE = 'battery_service' as BluetoothServiceUUID;
const BATTERY_LEVEL = 'battery_level' as BluetoothCharacteristicUUID;

export function isBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.bluetooth;
}

/** In-app nearby scan (Chrome 79+ with Bluetooth scanning enabled) */
export function canScanNearbyInApp(): boolean {
  return (
    isBluetoothSupported() &&
    typeof (navigator.bluetooth as Bluetooth & { requestLEScan?: unknown }).requestLEScan ===
      'function'
  );
}

export async function isBluetoothRadioOn(): Promise<boolean> {
  if (!navigator.bluetooth?.getAvailability) return true;
  return navigator.bluetooth.getAvailability();
}

export interface NearbyBluetoothDevice {
  id: string;
  name: string;
  rssi: number | null;
  device: BluetoothDevice;
}

export interface BluetoothLiveReading {
  deviceId: string;
  deviceName: string;
  heartRateBpm: number | null;
  batteryPercent: number | null;
  services: string[];
}

export type BluetoothReadingCallback = (reading: BluetoothLiveReading) => void;

function parseHeartRate(value: DataView): number {
  const flags = value.getUint8(0);
  if (flags & 0x01) return value.getUint16(1, true);
  return value.getUint8(1);
}

/**
 * Scan for nearby BLE devices and update list (strongest signal first).
 * Returns stop function. Throws if scanning API not available.
 */
export async function startNearbyScan(
  onUpdate: (devices: NearbyBluetoothDevice[]) => void
): Promise<() => void> {
  const bt = navigator.bluetooth as Bluetooth & {
    requestLEScan?: (options: {
      acceptAllAdvertisements?: boolean;
      keepRepeatedDevices?: boolean;
    }) => Promise<{ active: boolean; stop: () => void }>;
  };

  if (!bt?.requestLEScan) {
    throw new Error('SCAN_NOT_SUPPORTED');
  }

  const map = new Map<string, NearbyBluetoothDevice>();

  const scan = await bt.requestLEScan({
    acceptAllAdvertisements: true,
    keepRepeatedDevices: true,
  });

  const onAdvert = (event: Event) => {
    const ev = event as Event & {
      device: BluetoothDevice;
      rssi?: number;
      name?: string;
    };
    const d = ev.device;
    const name = (d.name || ev.name || '').trim() || 'Bluetooth device';
    map.set(d.id, {
      id: d.id,
      name,
      rssi: ev.rssi ?? null,
      device: d,
    });
    const list = [...map.values()].sort((a, b) => (b.rssi ?? -999) - (a.rssi ?? -999));
    onUpdate(list);
  };

  navigator.bluetooth!.addEventListener('advertisementreceived', onAdvert);

  return () => {
    scan.stop();
    navigator.bluetooth!.removeEventListener('advertisementreceived', onAdvert);
  };
}

/**
 * System Bluetooth picker — shows ALL nearby devices (phone, watch, band).
 */
export async function pickDeviceFromSystemList(): Promise<BluetoothDevice> {
  if (!navigator.bluetooth) {
    throw new Error(
      'Web Bluetooth unavailable. Use Chrome or Edge on localhost.'
    );
  }
  return navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [HR_SERVICE, BATTERY_SERVICE, 'device_information'],
  });
}

/**
 * Connect GATT to a chosen device and stream heart rate / battery.
 */
export async function connectGattToDevice(
  device: BluetoothDevice,
  onReading: BluetoothReadingCallback
): Promise<{ disconnect: () => void; getReading: () => BluetoothLiveReading }> {
  if (!device.gatt) {
    throw new Error('This device does not support BLE connection from the browser.');
  }

  const server = await device.gatt.connect();
  const services: string[] = [];
  let heartRateBpm: number | null = null;
  let batteryPercent: number | null = null;
  const cleanups: Array<() => void> = [];

  const emit = () => {
    onReading({
      deviceId: device.id,
      deviceName: device.name || 'Bluetooth device',
      heartRateBpm,
      batteryPercent,
      services,
    });
  };

  try {
    const hrService = await server.getPrimaryService(HR_SERVICE);
    services.push('heart_rate');
    const hrChar = await hrService.getCharacteristic(HR_MEASUREMENT);
    const onHr = (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (!value) return;
      heartRateBpm = parseHeartRate(value);
      emit();
    };
    hrChar.addEventListener('characteristicvaluechanged', onHr);
    await hrChar.startNotifications();
    cleanups.push(() => {
      hrChar.removeEventListener('characteristicvaluechanged', onHr);
      hrChar.stopNotifications().catch(() => {});
    });
    if (hrChar.value) heartRateBpm = parseHeartRate(hrChar.value);
  } catch {
    /* no standard HR — still connected */
  }

  try {
    const batService = await server.getPrimaryService(BATTERY_SERVICE);
    services.push('battery_service');
    const batChar = await batService.getCharacteristic(BATTERY_LEVEL);
    const readBattery = async () => {
      const val = await batChar.readValue();
      batteryPercent = val.getUint8(0);
      emit();
    };
    await readBattery();
    const onBat = () => readBattery();
    batChar.addEventListener('characteristicvaluechanged', onBat);
    await batChar.startNotifications().catch(() => {});
    cleanups.push(() => batChar.removeEventListener('characteristicvaluechanged', onBat));
  } catch {
    /* optional */
  }

  device.addEventListener('gattserverdisconnected', () => {
    heartRateBpm = null;
    emit();
  });

  emit();

  const disconnect = () => {
    cleanups.forEach((fn) => fn());
    if (device.gatt?.connected) device.gatt.disconnect();
  };

  return {
    disconnect,
    getReading: () => ({
      deviceId: device.id,
      deviceName: device.name || 'Bluetooth device',
      heartRateBpm,
      batteryPercent,
      services,
    }),
  };
}

/** @deprecated Use pick + connectGattToDevice */
export async function connectBluetoothDevice(onReading: BluetoothReadingCallback) {
  const device = await pickDeviceFromSystemList();
  return connectGattToDevice(device, onReading);
}

export function buildSyncPayload(reading: BluetoothLiveReading) {
  return {
    steps: 0,
    heartRateAvg: reading.heartRateBpm ?? undefined,
    heartRateResting: reading.heartRateBpm ?? undefined,
    activeMinutes: reading.heartRateBpm ? 1 : 0,
    syncedAt: new Date().toISOString(),
  };
}

export function formatBluetoothError(err: unknown, isTa: boolean): string {
  if (err instanceof DOMException) {
    if (err.name === 'NotFoundError') {
      return isTa
        ? 'நீங்கள் cancel செய்தீர்கள் அல்லது அருகில் சாதனம் இல்லை. Bluetooth ON & pairing mode பாருங்கள்.'
        : 'Cancelled or no device found. Turn Bluetooth ON and put device in pairing mode.';
    }
    if (err.name === 'NotAllowedError') {
      return isTa
        ? 'Bluetooth permission denied. Address bar-ல் Bluetooth அனுமதி கொடுங்கள்.'
        : 'Bluetooth permission denied. Allow Bluetooth for this site.';
    }
  }
  if (err instanceof Error) {
    if (err.message === 'SCAN_NOT_SUPPORTED') return '';
    return err.message;
  }
  return isTa ? 'Bluetooth பிழை' : 'Bluetooth error';
}
