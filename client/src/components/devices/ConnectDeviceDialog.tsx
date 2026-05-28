import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getModelsForProvider,
  type DeviceProviderInfo,
  type DeviceModel,
} from '@ai-fitness-coach/shared';
import { X, ExternalLink, Smartphone, Watch, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectResult {
  connection: { id: string; status: string };
  oauthUrl?: string;
  demoMode: boolean;
  connectionMode: 'oauth' | 'demo' | 'native';
  needsOAuth?: boolean;
  needsNativeConfirm?: boolean;
}

interface Props {
  provider: DeviceProviderInfo;
  isTa: boolean;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NATIVE_STEPS: Record<string, { en: string[]; ta: string[] }> = {
  HEALTH_CONNECT: {
    en: [
      'Open Settings → Apps → Health Connect on your Android phone',
      'Allow FitCoach (this app) to read Steps, Heart rate, Sleep',
      'Come back here and tap “I enabled on my phone”',
    ],
    ta: [
      'ஆண்ட்ராய்டு போனில் Settings → Apps → Health Connect திறக்கவும்',
      'படிகள், இதய துடிப்பு, தூக்கம் படிக்க அனுமதி கொடுக்கவும்',
      'இங்கே வந்து “போனில் இயக்கினேன்” அழுத்தவும்',
    ],
  },
  APPLE_HEALTH: {
    en: [
      'On iPhone: Health app → Sharing → Apps → enable this app',
      'Or install this app to Home Screen (PWA) for best sync',
      'Tap “I enabled on my phone” when done',
    ],
    ta: [
      'iPhone: Health → Sharing → Apps → இந்த app enable',
      'Home Screen-ல் PWA install செய்தால் நல்ல sync',
      'முடிந்தால் “போனில் இயக்கினேன்” அழுத்துங்கள்',
    ],
  },
  SAMSUNG_HEALTH: {
    en: [
      'Open Samsung Health on your phone & Galaxy Watch',
      'Settings → Connected services → allow data sharing',
      'Tap “I enabled on my phone” below',
    ],
    ta: [
      'Samsung Health & Galaxy Watch திறக்கவும்',
      'Connected services → data sharing enable',
      '“போனில் இயக்கினேன்” அழுத்தவும்',
    ],
  },
  GARMIN: {
    en: [
      'Open Garmin Connect app on your phone',
      'Sync your watch, then link third-party apps if available',
      'Tap “I enabled on my phone” below',
    ],
    ta: [
      'Garmin Connect app திறக்கவும்',
      'வாட்ச் sync செய்து third-party link செய்யவும்',
      '“போனில் இயக்கினேன்” அழுத்தவும்',
    ],
  },
};

export function ConnectDeviceDialog({ provider, isTa, open, onClose, onSuccess }: Props) {
  const models = getModelsForProvider(provider.id);
  const [selected, setSelected] = useState<DeviceModel | null>(null);
  const [step, setStep] = useState<'pick' | 'authorize' | 'native'>('pick');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const connectMutation = useMutation({
    mutationFn: async (opts: { nativeConfirmed?: boolean; deviceId?: string }) => {
      if (opts.deviceId && opts.nativeConfirmed) {
        await api.post(`/devices/${opts.deviceId}/confirm-native`);
        return null;
      }
      const res = await api.post('/devices/connect', {
        provider: provider.id,
        deviceName: selected?.name,
        modelId: selected?.id,
        imageUrl: selected?.imageUrl,
        nativeConfirmed: opts.nativeConfirmed,
      });
      return res.data.data as ConnectResult;
    },
    onSuccess: (data) => {
      if (!data) {
        onSuccess();
        handleClose();
        return;
      }
      if (data.needsOAuth && data.oauthUrl) {
        setPendingId(data.connection.id);
        setStep('authorize');
        const popup = window.open(data.oauthUrl, 'fitcoach_oauth', 'width=520,height=720');
        if (!popup) {
          setError(isTa ? 'Popup block — அனுமதி கொடுங்கள்' : 'Allow popups for OAuth login');
        }
        return;
      }
      if (data.needsNativeConfirm) {
        setPendingId(data.connection.id);
        setStep('native');
        return;
      }
      onSuccess();
      handleClose();
    },
    onError: () => setError(isTa ? 'இணைப்பு தோல்வி' : 'Connection failed'),
  });

  const handleClose = () => {
    setSelected(null);
    setStep('pick');
    setPendingId(null);
    setError('');
    onClose();
  };

  if (!open) return null;

  const steps = NATIVE_STEPS[provider.id];
  const TypeIcon = provider.deviceType === 'PHONE' ? Smartphone : Watch;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <img
                src={provider.imageUrl}
                alt={provider.name}
                className="w-16 h-16 rounded-xl object-cover border"
              />
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <TypeIcon className="h-5 w-5 text-primary" />
                  {isTa ? provider.nameTa : provider.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isTa ? 'உங்கள் உண்மையான சாதனத்தை தேர்வு செய்யுங்கள்' : 'Select your real device'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {step === 'pick' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelected(m)}
                    className={cn(
                      'rounded-xl border-2 overflow-hidden text-left transition-all hover:border-primary',
                      selected?.id === m.id ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                    )}
                  >
                    <img src={m.imageUrl} alt={m.name} className="w-full h-28 object-cover" />
                    <p className="p-2 text-xs font-medium leading-tight">
                      {isTa ? m.nameTa : m.name}
                    </p>
                  </button>
                ))}
              </div>
              {provider.oauthAvailable && (
                <Badge variant="secondary" className="text-xs">
                  {isTa ? 'OAuth வழி உண்மை sync (API key வேண்டும்)' : 'Live sync via OAuth when API keys are set'}
                </Badge>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                className="w-full"
                disabled={!selected || connectMutation.isPending}
                onClick={() => connectMutation.mutate({})}
              >
                {connectMutation.isPending
                  ? '...'
                  : isTa
                    ? 'அடுத்து — இணைக்க'
                    : 'Next — Connect device'}
              </Button>
            </>
          )}

          {step === 'authorize' && (
            <div className="space-y-4 text-center py-4">
              <ExternalLink className="h-10 w-10 mx-auto text-primary" />
              <p className="font-medium">
                {isTa
                  ? `${selected?.name ?? provider.name} — login window திறந்துள்ளது`
                  : `Sign in to ${selected?.name ?? provider.name} in the popup window`}
              </p>
              <p className="text-sm text-muted-foreground">
                {isTa
                  ? 'முடிந்தால் இந்த பக்கத்திற்கு திரும்பி Refresh அழுத்துங்கள்'
                  : 'When finished, return here and refresh the list'}
              </p>
              <Button
                onClick={() => {
                  onSuccess();
                  handleClose();
                }}
              >
                {isTa ? 'முடிந்தது — Refresh' : 'Done — Refresh'}
              </Button>
            </div>
          )}

          {step === 'native' && steps && (
            <div className="space-y-4">
              {selected && (
                <img
                  src={selected.imageUrl}
                  alt={selected.name}
                  className="w-full h-40 object-cover rounded-xl"
                />
              )}
              <ol className="list-decimal list-inside text-sm space-y-2 text-muted-foreground">
                {(isTa ? steps.ta : steps.en).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                className="w-full"
                disabled={connectMutation.isPending || !pendingId}
                onClick={() =>
                  connectMutation.mutate({ nativeConfirmed: true, deviceId: pendingId! })
                }
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {isTa ? 'போனில் இயக்கினேன்' : 'I enabled on my phone'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
