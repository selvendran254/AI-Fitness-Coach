import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  isBluetoothSupported,
  isBluetoothRadioOn,
  connectGattToDevice,
  buildSyncPayload,
  formatBluetoothError,
  type BluetoothLiveReading,
} from '@/lib/bluetooth';
import { NearbyBluetoothModal } from '@/components/devices/NearbyBluetoothModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Heart,
  Battery,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';

interface Props {
  isTa: boolean;
  serverDeviceId?: string;
}

export function BluetoothConnectCard({ isTa, serverDeviceId }: Props) {
  const queryClient = useQueryClient();
  const [reading, setReading] = useState<BluetoothLiveReading | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [btOn, setBtOn] = useState<boolean | null>(null);
  const sessionRef = useRef<{ disconnect: () => void } | null>(null);
  const serverIdRef = useRef<string | undefined>(serverDeviceId);
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isBluetoothRadioOn().then(setBtOn);
  }, []);

  const registerMutation = useMutation({
    mutationFn: async (r: BluetoothLiveReading) => {
      const res = await api.post('/devices/bluetooth/register', {
        deviceName: r.deviceName,
        bleDeviceId: r.deviceId,
        bleServices: r.services,
        batteryPercent: r.batteryPercent ?? undefined,
        syncData: buildSyncPayload(r),
      });
      return res.data.data as { id: string };
    },
    onSuccess: (data) => {
      serverIdRef.current = data.id;
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });

  const pushMutation = useMutation({
    mutationFn: async (r: BluetoothLiveReading) => {
      const id = serverIdRef.current;
      if (!id) return;
      await api.post(`/devices/${id}/bluetooth/push`, {
        syncData: buildSyncPayload(r),
        batteryPercent: r.batteryPercent ?? undefined,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices'] }),
  });

  const schedulePush = useCallback(
    (r: BluetoothLiveReading) => {
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      pushTimerRef.current = setTimeout(() => {
        if (serverIdRef.current) pushMutation.mutate(r);
      }, 3000);
    },
    [pushMutation]
  );

  const finishConnect = async (device: BluetoothDevice) => {
    setConnecting(true);
    setError('');
    try {
      const session = await connectGattToDevice(device, (r) => {
        setReading(r);
        if (serverIdRef.current) schedulePush(r);
      });
      sessionRef.current = session;
      setConnected(true);
      const initial = session.getReading();
      setReading(initial);
      await registerMutation.mutateAsync(initial);
    } catch (e) {
      setError(formatBluetoothError(e, isTa));
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  };

  const handleStartConnect = () => {
    setError('');
    if (btOn === false) {
      setError(
        isTa
          ? 'Computer/phone Bluetooth OFF. Settings-ல் ON செய்யுங்கள்.'
          : 'Bluetooth is OFF. Turn it on in system settings.'
      );
      return;
    }
    setShowScanner(true);
  };

  const handleDisconnect = () => {
    sessionRef.current?.disconnect();
    sessionRef.current = null;
    setConnected(false);
    setReading(null);
    if (serverIdRef.current) {
      api.delete(`/devices/${serverIdRef.current}`).finally(() => {
        serverIdRef.current = undefined;
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      });
    }
  };

  useEffect(() => {
    serverIdRef.current = serverDeviceId;
  }, [serverDeviceId]);

  useEffect(() => {
    return () => {
      sessionRef.current?.disconnect();
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    };
  }, []);

  const supported = isBluetoothSupported();

  return (
    <>
      <Card className="border-border/60 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bluetooth className="h-6 w-6 text-blue-600" />
            {isTa ? 'போன் / வாட்ச் — Bluetooth' : 'Phone / Watch — Bluetooth'}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            {isTa
              ? 'Connect → அருகிலுள்ள சாதனங்கள் list → உங்கள் phone/watch தேர்வு → இணை'
              : 'Connect → see nearby devices → pick your phone or watch → paired'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!supported && (
            <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-200 text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p>
                {isTa
                  ? 'Chrome அல்லது Edge use பண்ணுங்கள் (localhost). Firefox/iPhone Safari work ஆகாது.'
                  : 'Use Chrome or Edge on localhost. Firefox and iPhone Safari do not support this.'}
              </p>
            </div>
          )}

          <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              {isTa ? 'எப்படி இணைப்பது?' : 'How to connect?'}
            </p>
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>
                {isTa
                  ? 'உங்கள் phone/watch-ல் Bluetooth ON செய்யுங்கள்'
                  : 'Turn Bluetooth ON on your phone or watch'}
              </li>
              <li>
                {isTa
                  ? 'Watch இருந்தால் pairing mode / Settings → Bluetooth → Pair new'
                  : 'For watches: open pairing mode or Pair new device'}
              </li>
              <li>
                {isTa
                  ? 'கீழே "Connect" அழுத்துங்கள் — searching list வரும்'
                  : 'Tap "Connect" below — searching list appears'}
              </li>
              <li>
                {isTa
                  ? 'List-ல் உங்கள் சாதனம் தெரிந்தால் அதை அழுத்தி இணைக்கவும்'
                  : 'Tap your device name in the list to connect'}
              </li>
            </ol>
          </div>

          {connected && reading && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2">
                <BluetoothConnected className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">{isTa ? 'இணைக்கப்பட்டது' : 'Connected'}</p>
                  <p className="font-medium text-sm truncate">{reading.deviceName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{isTa ? 'இதயம்' : 'Heart'}</p>
                  <p className="font-bold text-lg">
                    {reading.heartRateBpm != null ? `${reading.heartRateBpm} bpm` : '—'}
                  </p>
                </div>
              </div>
              {reading.batteryPercent != null && (
                <div className="flex items-center gap-2 col-span-2">
                  <Battery className="h-5 w-5 text-green-600" />
                  <p className="text-sm">{reading.batteryPercent}%</p>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            {!connected ? (
            <Button
              className="flex-1"
              disabled={!supported || connecting}
              onClick={handleStartConnect}
            >
                <Bluetooth className="h-4 w-4 mr-2" />
                {connecting
                  ? isTa
                    ? 'இணைக்கிறது...'
                    : 'Connecting...'
                  : isTa
                    ? 'Connect — அருகிலுள்ள சாதனம் தேடு'
                    : 'Connect — search nearby'}
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" onClick={handleDisconnect}>
                <BluetoothOff className="h-4 w-4 mr-2" />
                {isTa ? 'துண்டிக்க' : 'Disconnect'}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{isTa ? 'அருகிலுள்ள scan' : 'Nearby scan'}</Badge>
            <Badge variant="outline">{isTa ? 'Phone + Watch' : 'Phone + Watch'}</Badge>
          </div>
        </CardContent>
      </Card>

      <NearbyBluetoothModal
        isTa={isTa}
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onSelectDevice={(device) => {
          setShowScanner(false);
          finishConnect(device);
        }}
      />
    </>
  );
}
