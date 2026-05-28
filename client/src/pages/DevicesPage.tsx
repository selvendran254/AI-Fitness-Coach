import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useSettingsStore } from '@/stores/settingsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Smartphone, Watch, RefreshCw, Link2, Unlink, CheckCircle2,
  Heart, Footprints, Moon, Activity, Radio, Bluetooth,
} from 'lucide-react';
import type { DeviceConnection, DeviceProviderInfo, WearableSyncData } from '@ai-fitness-coach/shared';
import { DEVICE_PROVIDERS } from '@ai-fitness-coach/shared';
import { ConnectDeviceDialog } from '@/components/devices/ConnectDeviceDialog';
import { BluetoothConnectCard } from '@/components/devices/BluetoothConnectCard';
import { QrPairingCard } from '@/components/devices/QrPairingCard';
import { OAuthSetupWizard } from '@/components/devices/OAuthSetupWizard';
import { PageHeader } from '@/components/ui/PageHeader';

type DeviceMeta = { imageUrl?: string; mode?: string; modelId?: string };

export default function DevicesPage() {
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const queryClient = useQueryClient();
  const settings = useUserSettings();
  const setSettings = useSettingsStore((s) => s.setSettings);
  const [connectProvider, setConnectProvider] = useState<DeviceProviderInfo | null>(null);

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const res = await api.get('/devices');
      return res.data.data as DeviceConnection[];
    },
  });

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'fitcoach-oauth') {
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        setConnectProvider(null);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [queryClient]);

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/devices/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices'] }),
  });

  const syncMutation = useMutation({
    mutationFn: (id?: string) =>
      id ? api.post(`/devices/${id}/sync`) : api.post('/devices/sync-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setSettings({ syncWithWearable: true });
    },
  });

  const connected = devices.filter((d) => d.status === 'CONNECTED');
  const pending = devices.filter((d) => d.status === 'PENDING');
  const phones = DEVICE_PROVIDERS.filter((p) => p.deviceType === 'PHONE');
  const watches = DEVICE_PROVIDERS.filter((p) => p.deviceType === 'WATCH' && p.id !== 'BLUETOOTH');
  const bleServerDevice = devices.find((d) => d.provider === 'BLUETOOTH');

  const getConnection = (providerId: string) =>
    devices.find((d) => d.provider === providerId && (d.status === 'CONNECTED' || d.status === 'PENDING'));

  return (
    <div className="page-shell max-w-4xl">
      <PageHeader
        icon={Smartphone}
        title={isTa ? 'போன் & வாட்ச்' : 'Phone & Watch'}
        description={
          isTa
            ? 'உங்கள் சாதனத்தை படத்துடன் தேர்வு செய்து இணைக்கவும்'
            : 'Connect your phone or watch with a clear, simple flow'
        }
      >
        {connected.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => syncMutation.mutate(undefined)}
            disabled={syncMutation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            {isTa ? 'Sync all' : 'Sync all'}
          </Button>
        )}
      </PageHeader>

      {connected.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              {isTa ? 'இணைக்கப்பட்ட சாதனங்கள்' : 'Connected devices'} ({connected.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connected.map((device) => (
              <ConnectedDeviceCard
                key={device.id}
                device={device}
                isTa={isTa}
                onSync={() => syncMutation.mutate(device.id)}
                onDisconnect={() => disconnectMutation.mutate(device.id)}
                syncing={syncMutation.isPending}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {pending.length > 0 && (
        <Card className="border-amber-500/40">
          <CardHeader>
            <CardTitle className="text-base text-amber-700 dark:text-amber-400">
              {isTa ? 'நிலுவையில் உள்ள இணைப்பு' : 'Pending connection'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {pending.map((d) => (
              <p key={d.id}>
                {d.deviceName} — {isTa ? 'OAuth அல்லது போன் setup முடிக்கவும்' : 'Finish OAuth or phone setup'}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="bluetooth">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="bluetooth" className="gap-2">
            <Bluetooth className="h-4 w-4" />
            {isTa ? 'ப்ளூடூத்' : 'Bluetooth'}
          </TabsTrigger>
          <TabsTrigger value="phone" className="gap-2">
            <Smartphone className="h-4 w-4" />
            {isTa ? 'போன்' : 'Phone'} ({phones.length})
          </TabsTrigger>
          <TabsTrigger value="watch" className="gap-2">
            <Watch className="h-4 w-4" />
            {isTa ? 'வாட்ச்' : 'Watch'} ({watches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bluetooth" className="space-y-4 mt-4">
          <QrPairingCard isTa={isTa} />
          <OAuthSetupWizard />
          <BluetoothConnectCard
            isTa={isTa}
            serverDeviceId={bleServerDevice?.id}
          />
        </TabsContent>

        <TabsContent value="phone" className="space-y-4 mt-4">
          {phones.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              isTa={isTa}
              connection={getConnection(p.id)}
              onConnect={() => setConnectProvider(p)}
              onDisconnect={() => {
                const d = devices.find((x) => x.provider === p.id);
                if (d) disconnectMutation.mutate(d.id);
              }}
            />
          ))}
        </TabsContent>

        <TabsContent value="watch" className="space-y-4 mt-4">
          {watches.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              isTa={isTa}
              connection={getConnection(p.id)}
              onConnect={() => setConnectProvider(p)}
              onDisconnect={() => {
                const d = devices.find((x) => x.provider === p.id);
                if (d) disconnectMutation.mutate(d.id);
              }}
            />
          ))}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isTa ? 'உண்மையான Fitbit / Google sync' : 'Live Fitbit / Google sync'}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            {isTa
              ? 'server/.env-ல் FITBIT_CLIENT_ID, GOOGLE_FIT_CLIENT_ID சேர்த்தால் OAuth வழி உண்மை படிகள் வரும்.'
              : 'Add FITBIT_CLIENT_ID and GOOGLE_FIT_CLIENT_ID to server/.env for real OAuth sync from your account.'}
          </p>
          <p>4. {isTa ? `Auto sync every ${settings.syncFrequencyMinutes} min` : `Auto-sync every ${settings.syncFrequencyMinutes} minutes`}</p>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground text-sm">Loading devices...</p>}

      {connectProvider && (
        <ConnectDeviceDialog
          provider={connectProvider}
          isTa={isTa}
          open={!!connectProvider}
          onClose={() => setConnectProvider(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            setSettings({ syncWithWearable: true });
          }}
        />
      )}
    </div>
  );
}

function ProviderCard({
  provider,
  isTa,
  connection,
  onConnect,
  onDisconnect,
}: {
  provider: DeviceProviderInfo;
  isTa: boolean;
  connection?: DeviceConnection;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const connected = connection?.status === 'CONNECTED';
  const pending = connection?.status === 'PENDING';

  return (
    <Card className={connected ? 'border-primary' : ''}>
      <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <img
          src={provider.imageUrl}
          alt={provider.name}
          className="w-24 h-24 rounded-xl object-cover border shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{isTa ? provider.nameTa : provider.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isTa ? provider.descriptionTa : provider.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {provider.supports.map((s) => (
              <Badge key={s} variant="secondary" className="text-xs capitalize">
                {s.replace('_', ' ')}
              </Badge>
            ))}
            {connected && (
              <Badge className="text-xs gap-1">
                <Radio className="h-3 w-3" />
                {isTa ? 'இணைக்கப்பட்டது' : 'Linked'}
              </Badge>
            )}
            {pending && (
              <Badge variant="outline" className="text-xs">
                {isTa ? 'நிலுவை' : 'Pending'}
              </Badge>
            )}
          </div>
        </div>
        {connected || pending ? (
          <Button variant="outline" size="sm" onClick={onDisconnect}>
            <Unlink className="h-4 w-4 mr-1" />
            {isTa ? 'நீக்கு' : 'Disconnect'}
          </Button>
        ) : (
          <Button size="sm" onClick={onConnect}>
            <Link2 className="h-4 w-4 mr-1" />
            {isTa ? 'இணைக்க' : 'Connect'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ConnectedDeviceCard({
  device,
  isTa,
  onSync,
  onDisconnect,
  syncing,
}: {
  device: DeviceConnection;
  isTa: boolean;
  onSync: () => void;
  onDisconnect: () => void;
  syncing: boolean;
}) {
  const data = device.lastSyncData as WearableSyncData | null | undefined;
  const meta = (device as DeviceConnection & { metadata?: DeviceMeta }).metadata ?? {};
  const imageUrl = meta.imageUrl;
  const isLive = meta.mode === 'oauth' || meta.mode === 'bluetooth';

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover border" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
              {device.deviceType === 'PHONE' ? (
                <Smartphone className="h-6 w-6 text-primary" />
              ) : (
                <Watch className="h-6 w-6 text-primary" />
              )}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium truncate">{device.deviceName ?? device.provider}</p>
            <p className="text-xs text-muted-foreground">
              {device.lastSyncAt
                ? `${isTa ? 'கடைசி sync' : 'Last sync'}: ${new Date(device.lastSyncAt).toLocaleString()}`
                : isTa
                  ? 'இன்னும் sync இல்லை'
                  : 'Not synced yet'}
            </p>
            <Badge variant={isLive ? 'default' : 'secondary'} className="text-[10px] mt-1">
              {meta.mode === 'bluetooth'
                ? isTa
                  ? 'ப்ளூடூத் live'
                  : 'Bluetooth live'
                : isLive
                  ? isTa
                    ? 'உண்மை OAuth sync'
                    : 'Live OAuth sync'
                  : isTa
                    ? 'போன் வழி sync'
                    : 'Phone / demo sync'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onSync} disabled={syncing}>
            <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDisconnect}>
            <Unlink className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SyncStat icon={Footprints} label={isTa ? 'படிகள்' : 'Steps'} value={data.steps.toLocaleString()} />
          <SyncStat icon={Heart} label={isTa ? 'இதயம்' : 'Heart'} value={`${data.heartRateAvg ?? '—'} bpm`} />
          <SyncStat icon={Moon} label={isTa ? 'தூக்கம்' : 'Sleep'} value={`${data.sleepHours?.toFixed(1) ?? '—'}h`} />
          <SyncStat icon={Activity} label={isTa ? 'செயல்' : 'Active'} value={`${data.activeMinutes ?? '—'} min`} />
        </div>
      )}
    </div>
  );
}

function SyncStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Footprints;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center p-2 rounded-md bg-muted/50">
      <Icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
