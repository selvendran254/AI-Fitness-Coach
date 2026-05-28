import type { UserSettings } from '@ai-fitness-coach/shared';
import { SettingRow } from '../SettingRow';
import { SettingSlider } from '../SettingSlider';
import { SettingsSection } from '../SettingsSection';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

export function SleepTrackerSettings({ settings, update }: Props) {
  return (
    <SettingsSection title="Sleep & recovery" description="Sleep affects glucose and BP — track it closely">
      <SettingRow label="Sleep tracking" checked={settings.sleepTrackingEnabled} onCheckedChange={(v) => update('sleepTrackingEnabled', v)} />
      <SettingSlider label="Sleep goal" value={settings.dailySleepGoalHours} min={5} max={12} step={0.5} unit="hours" onChange={(v) => update('dailySleepGoalHours', v)} />
      <div className="grid grid-cols-2 gap-4 py-3">
        <div className="space-y-2"><Label>Bedtime reminder</Label><Input type="time" value={settings.bedtimeReminder ?? ''} onChange={(e) => update('bedtimeReminder', e.target.value)} /></div>
        <div className="space-y-2"><Label>Wake reminder</Label><Input type="time" value={settings.wakeReminder ?? ''} onChange={(e) => update('wakeReminder', e.target.value)} /></div>
      </div>
      <SettingRow label="Track sleep stages" description="Requires wearable" checked={settings.trackSleepStages} onCheckedChange={(v) => update('trackSleepStages', v)} />
      <SettingRow label="Nap tracking" checked={settings.napTracking} onCheckedChange={(v) => update('napTracking', v)} />
      <SettingSlider label="Screen-free before bed" value={settings.screenFreeBeforeBedMinutes} min={0} max={120} step={15} unit="min" onChange={(v) => update('screenFreeBeforeBedMinutes', v)} />
      <SettingRow label="Smart alarm" description="Wake during light sleep phase" checked={settings.smartAlarmEnabled} onCheckedChange={(v) => update('smartAlarmEnabled', v)} />
      <SettingRow label="Mood tracking" checked={settings.moodTrackingEnabled} onCheckedChange={(v) => update('moodTrackingEnabled', v)} />
      <SettingRow label="Energy level tracking" checked={settings.energyLevelTracking} onCheckedChange={(v) => update('energyLevelTracking', v)} />
      <SettingRow label="Stress level tracking" checked={settings.stressLevelTracking} onCheckedChange={(v) => update('stressLevelTracking', v)} />
    </SettingsSection>
  );
}
