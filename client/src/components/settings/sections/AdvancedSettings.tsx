import { Link } from 'react-router-dom';
import type { UserSettings } from '@ai-fitness-coach/shared';
import { Button } from '@/components/ui/button';
import { SettingSelect } from '../SettingSelect';
import { SettingRow } from '../SettingRow';
import { SettingSlider } from '../SettingSlider';
import { SettingsSection } from '../SettingsSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link2 } from 'lucide-react';

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

export function AdvancedSettings({ settings, update }: Props) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Wearables & sync">
        <div className="py-3">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link to="/devices">
              <Link2 className="h-4 w-4 mr-2" />
              Connect Phone & Watch
            </Link>
          </Button>
        </div>
        <SettingRow label="Sync with wearable" checked={settings.syncWithWearable} onCheckedChange={(v) => update('syncWithWearable', v)} />
        <SettingSelect label="Wearable provider" value={settings.wearableProvider} options={[{ value: 'none', label: 'None' }, { value: 'fitbit', label: 'Fitbit' }, { value: 'google_fit', label: 'Google Fit' }, { value: 'apple_health', label: 'Apple Health' }, { value: 'samsung', label: 'Samsung Health' }, { value: 'garmin', label: 'Garmin' }]} onValueChange={(v) => update('wearableProvider', v as UserSettings['wearableProvider'])} />
        <SettingSlider label="Sync frequency" value={settings.syncFrequencyMinutes} min={5} max={60} unit="min" onChange={(v) => update('syncFrequencyMinutes', v)} />
        <SettingRow label="Step tracking" checked={settings.stepTrackingEnabled} onCheckedChange={(v) => update('stepTrackingEnabled', v)} />
        <SettingRow label="Period tracking" checked={settings.periodTrackingEnabled} onCheckedChange={(v) => update('periodTrackingEnabled', v)} />
      </SettingsSection>

      <CardAccordionOffline settings={settings} update={update} />
    </div>
  );
}

function CardAccordionOffline({ settings, update }: Props) {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="offline">
        <AccordionTrigger className="text-lg font-semibold px-6">Offline, PWA & backup</AccordionTrigger>
        <AccordionContent className="px-6 divide-y">
          <SettingRow label="Offline mode" checked={settings.offlineModeEnabled} onCheckedChange={(v) => update('offlineModeEnabled', v)} />
          <SettingRow label="Auto-sync on reconnect" checked={settings.autoSyncOnReconnect} onCheckedChange={(v) => update('autoSyncOnReconnect', v)} />
          <SettingRow label="Cache workout plans" checked={settings.cacheWorkoutPlans} onCheckedChange={(v) => update('cacheWorkoutPlans', v)} />
          <SettingRow label="Cache meal plans" checked={settings.cacheMealPlans} onCheckedChange={(v) => update('cacheMealPlans', v)} />
          <SettingSelect label="Backup frequency" value={settings.backupFrequency} options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'never', label: 'Never' }]} onValueChange={(v) => update('backupFrequency', v as UserSettings['backupFrequency'])} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="developer">
        <AccordionTrigger className="text-lg font-semibold px-6">Developer & beta</AccordionTrigger>
        <AccordionContent className="px-6 divide-y">
          <SettingRow label="Beta features" checked={settings.betaFeaturesEnabled} onCheckedChange={(v) => update('betaFeaturesEnabled', v)} />
          <SettingRow label="Debug mode" checked={settings.debugMode} onCheckedChange={(v) => update('debugMode', v)} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
