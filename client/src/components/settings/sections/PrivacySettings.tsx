import type { UserSettings } from '@ai-fitness-coach/shared';
import { SettingSelect } from '../SettingSelect';
import { SettingRow } from '../SettingRow';
import { SettingSlider } from '../SettingSlider';
import { SettingsSection } from '../SettingsSection';

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

export function PrivacySettings({ settings, update }: Props) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Visibility">
        <SettingSelect label="Profile visibility" value={settings.profileVisibility} options={[{ value: 'public', label: 'Public' }, { value: 'friends', label: 'Friends only' }, { value: 'private', label: 'Private' }]} onValueChange={(v) => update('profileVisibility', v as UserSettings['profileVisibility'])} />
        <SettingRow label="Show on leaderboard" checked={settings.showOnLeaderboard} onCheckedChange={(v) => update('showOnLeaderboard', v)} />
        <SettingRow label="Share progress with friends" checked={settings.shareProgressWithFriends} onCheckedChange={(v) => update('shareProgressWithFriends', v)} />
        <SettingRow label="Share workout history" checked={settings.shareWorkoutHistory} onCheckedChange={(v) => update('shareWorkoutHistory', v)} />
        <SettingRow label="Share nutrition logs" checked={settings.shareNutritionLogs} onCheckedChange={(v) => update('shareNutritionLogs', v)} />
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingRow label="Two-factor authentication" checked={settings.twoFactorEnabled} onCheckedChange={(v) => update('twoFactorEnabled', v)} />
        <SettingRow label="Biometric login" checked={settings.biometricLoginEnabled} onCheckedChange={(v) => update('biometricLoginEnabled', v)} />
        <SettingSlider label="Session timeout" value={settings.sessionTimeoutMinutes} min={15} max={480} step={15} unit="min" onChange={(v) => update('sessionTimeoutMinutes', v)} />
      </SettingsSection>

      <SettingsSection title="Data & analytics">
        <SettingRow label="Usage analytics (Mixpanel)" checked={settings.analyticsEnabled} onCheckedChange={(v) => update('analyticsEnabled', v)} />
        <SettingRow label="Research data opt-in" description="Anonymized data for diabetes research" checked={settings.researchDataOptIn} onCheckedChange={(v) => update('researchDataOptIn', v)} />
        <SettingRow label="Location tracking" checked={settings.locationTrackingEnabled} onCheckedChange={(v) => update('locationTrackingEnabled', v)} />
        <SettingSlider label="Data retention" value={settings.dataRetentionDays} min={30} max={730} step={30} unit="days" onChange={(v) => update('dataRetentionDays', v)} />
        <SettingRow label="Include photos in exports" checked={settings.exportIncludePhotos} onCheckedChange={(v) => update('exportIncludePhotos', v)} />
        <SettingRow label="Anonymize exports" checked={settings.anonymizeExports} onCheckedChange={(v) => update('anonymizeExports', v)} />
        <SettingSelect label="Default export format" value={settings.defaultExportFormat} options={[{ value: 'csv', label: 'CSV' }, { value: 'pdf', label: 'PDF' }, { value: 'json', label: 'JSON' }]} onValueChange={(v) => update('defaultExportFormat', v as UserSettings['defaultExportFormat'])} />
      </SettingsSection>
    </div>
  );
}
