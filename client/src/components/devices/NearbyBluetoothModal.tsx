import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bluetooth,
  Loader2,
  Smartphone,
  Watch,
  Signal,
  X,
  Radio,
} from 'lucide-react';
import {
  canScanNearbyInApp,
  startNearbyScan,
  pickDeviceFromSystemList,
  formatBluetoothError,
  type NearbyBluetoothDevice,
} from '@/lib/bluetooth';
import { cn } from '@/lib/utils';

type Phase = 'searching' | 'list' | 'picker-hint';

interface Props {
  isTa: boolean;
  open: boolean;
  onClose: () => void;
  onSelectDevice: (device: BluetoothDevice) => void;
}

export function NearbyBluetoothModal({ isTa, open, onClose, onSelectDevice }: Props) {
  const [devices, setDevices] = useState<NearbyBluetoothDevice[]>([]);
  const [phase, setPhase] = useState<Phase>('searching');
  const [error, setError] = useState('');
  const [openingPicker, setOpeningPicker] = useState(false);
  const stopScanRef = useRef<(() => void) | null>(null);
  const inAppScan = canScanNearbyInApp();

  useEffect(() => {
    if (!open) return;

    setDevices([]);
    setError('');
    setPhase(inAppScan ? 'searching' : 'picker-hint');

    if (!inAppScan) return;

    let cancelled = false;

    (async () => {
      try {
        const stop = await startNearbyScan((list) => {
          if (!cancelled) {
            setDevices(list);
            if (list.length > 0) setPhase('list');
          }
        });
        stopScanRef.current = stop;
        setTimeout(() => {
          if (!cancelled) setPhase('list');
        }, 6000);
      } catch {
        if (!cancelled) setPhase('picker-hint');
      }
    })();

    return () => {
      cancelled = true;
      stopScanRef.current?.();
      stopScanRef.current = null;
    };
  }, [open, inAppScan]);

  const handleOpenSystemPicker = async () => {
    setOpeningPicker(true);
    setError('');
    try {
      const device = await pickDeviceFromSystemList();
      stopScanRef.current?.();
      onSelectDevice(device);
      onClose();
    } catch (e) {
      const msg = formatBluetoothError(e, isTa);
      if (msg) setError(msg);
    } finally {
      setOpeningPicker(false);
    }
  };

  const handlePickFromList = (item: NearbyBluetoothDevice) => {
    stopScanRef.current?.();
    onSelectDevice(item.device);
    onClose();
  };

  if (!open) return null;

  const stepsTa = [
    '1. Connect அழுத்துங்கள்',
    '2. "Searching nearby…" வரும்',
    '3. List-ல் உங்கள் phone/watch தேர்வு',
    '4. Pair / Connect அழுத்தினால் இணைப்பு முடியும்',
  ];
  const stepsEn = [
    '1. Tap Connect',
    '2. Wait for "Searching nearby…"',
    '3. Pick your phone or watch from the list',
    '4. Confirm pairing — done',
  ];
  const steps = isTa ? stepsTa : stepsEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <Card className="w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl">
        <CardContent className="pt-6 pb-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Bluetooth className="h-5 w-5 text-blue-600" />
              {isTa ? 'அருகிலுள்ள Bluetooth' : 'Nearby Bluetooth'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            {steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>

          {phase === 'searching' && inAppScan && (
            <div className="flex flex-col items-center py-8 gap-3">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="font-medium">
                {isTa ? 'அருகிலுள்ள சாதனங்கள் தேடுகிறது…' : 'Searching nearby devices…'}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                {isTa
                  ? 'Phone/Watch Bluetooth ON, pairing mode-ல் வையுங்கள்'
                  : 'Keep phone/watch Bluetooth ON and in pairing mode'}
              </p>
            </div>
          )}

          {(phase === 'list' || (phase === 'searching' && devices.length > 0)) && (
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              <p className="text-sm font-medium flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary" />
                {isTa
                  ? `${devices.length} சாதனம் கண்டுபிடிக்கப்பட்டது — ஒன்றை தேர்வு செய்யுங்கள்`
                  : `${devices.length} device(s) found — tap to connect`}
              </p>
              {devices.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {isTa
                    ? 'இன்னும் சாதனம் இல்லை. கீழே "System list" try செய்யுங்கள்.'
                    : 'No devices yet. Try "Open system list" below.'}
                </p>
              ) : (
                devices.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handlePickFromList(d)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg border text-left',
                      'hover:border-primary hover:bg-primary/5 transition-colors'
                    )}
                  >
                    {d.name.toLowerCase().includes('phone') ||
                    d.name.toLowerCase().includes('iphone') ||
                    d.name.toLowerCase().includes('galaxy') ? (
                      <Smartphone className="h-8 w-8 text-blue-600 shrink-0" />
                    ) : (
                      <Watch className="h-8 w-8 text-blue-600 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{d.name}</p>
                      {d.rssi != null && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Signal className="h-3 w-3" />
                          {isTa ? 'சிக்னல்' : 'Signal'}: {d.rssi} dBm
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-primary font-semibold shrink-0">
                      {isTa ? 'இணைக்க' : 'Connect'}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {(phase === 'picker-hint' || !inAppScan) && (
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
              <p className="text-sm font-medium">
                {isTa
                  ? 'Chrome Bluetooth பட்டியல் திறக்கும் — அங்கே அருகிலுள்ள phone/watch தெரியும்'
                  : 'Chrome will open a Bluetooth list — your nearby phone/watch will appear there'}
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={openingPicker}
                onClick={handleOpenSystemPicker}
              >
                {openingPicker ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Bluetooth className="h-4 w-4 mr-2" />
                )}
                {isTa ? 'அருகிலுள்ள சாதன பட்டியல் திற' : 'Open nearby device list'}
              </Button>
            </div>
          )}

          {inAppScan && (
            <Button variant="outline" size="sm" onClick={handleOpenSystemPicker} disabled={openingPicker}>
              {isTa ? 'அல்லது System பட்டியல் (Chrome popup)' : 'Or use system list (Chrome popup)'}
            </Button>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
