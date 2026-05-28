import type { UserSettings } from '@ai-fitness-coach/shared';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingRow } from '../SettingRow';
import { SettingSlider } from '../SettingSlider';
import { SettingsSection } from '../SettingsSection';

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

export function NotificationsSettings({ settings, update }: Props) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Channels">
        <SettingRow label="Push notifications" checked={settings.pushNotificationsEnabled} onCheckedChange={(v) => update('pushNotificationsEnabled', v)} />
        <SettingRow label="Email notifications" checked={settings.emailNotificationsEnabled} onCheckedChange={(v) => update('emailNotificationsEnabled', v)} />
        <SettingRow label="SMS alerts" checked={settings.smsNotificationsEnabled} onCheckedChange={(v) => update('smsNotificationsEnabled', v)} />
        <SettingRow label="Quiet hours" checked={settings.quietHoursEnabled} onCheckedChange={(v) => update('quietHoursEnabled', v)} />
        <div className="grid grid-cols-2 gap-4 py-3">
          <div className="space-y-2"><Label>Quiet hours start</Label><Input type="time" value={settings.quietHoursStart ?? ''} onChange={(e) => update('quietHoursStart', e.target.value)} disabled={!settings.quietHoursEnabled} /></div>
          <div className="space-y-2"><Label>Quiet hours end</Label><Input type="time" value={settings.quietHoursEnd ?? ''} onChange={(e) => update('quietHoursEnd', e.target.value)} disabled={!settings.quietHoursEnabled} /></div>
        </div>
        <SettingRow label="Priority alerts only" description="Only glucose/BP emergencies" checked={settings.priorityAlertsOnly} onCheckedChange={(v) => update('priorityAlertsOnly', v)} />
      </SettingsSection>

      <SettingsSection title="Fitness & health alerts">
        <SettingRow label="Workout reminders" checked={settings.workoutReminders} onCheckedChange={(v) => update('workoutReminders', v)} />
        <SettingSlider label="Remind before workout" value={settings.workoutReminderLeadMinutes} min={5} max={120} step={5} unit="min" onChange={(v) => update('workoutReminderLeadMinutes', v)} />
        <SettingRow label="Water reminders" checked={settings.waterRemindersEnabled} onCheckedChange={(v) => update('waterRemindersEnabled', v)} />
        <SettingSlider label="Water reminder interval" value={settings.waterReminderIntervalMinutes} min={30} max={240} step={15} unit="min" onChange={(v) => update('waterReminderIntervalMinutes', v)} />
        <SettingSlider label="Glass size" value={settings.glassSizeMl} min={100} max={500} step={50} unit="ml" onChange={(v) => update('glassSizeMl', v)} />
        <SettingRow label="Glucose alert notifications" checked={settings.glucoseAlertNotifications} onCheckedChange={(v) => update('glucoseAlertNotifications', v)} />
        <SettingRow label="BP alert notifications" checked={settings.bpAlertNotifications} onCheckedChange={(v) => update('bpAlertNotifications', v)} />
        <SettingRow label="AI coach tips" checked={settings.aiCoachTips} onCheckedChange={(v) => update('aiCoachTips', v)} />
        <SettingRow label="Challenge updates" checked={settings.challengeUpdates} onCheckedChange={(v) => update('challengeUpdates', v)} />
      </SettingsSection>

      <SettingsSection title="Social & reports">
        <SettingRow label="Streak notifications" checked={settings.streakNotifications} onCheckedChange={(v) => update('streakNotifications', v)} />
        <SettingRow label="Achievement badges" checked={settings.achievementBadges} onCheckedChange={(v) => update('achievementBadges', v)} />
        <SettingRow label="Friend requests" checked={settings.friendRequestNotifications} onCheckedChange={(v) => update('friendRequestNotifications', v)} />
        <SettingRow label="Weekly email report" checked={settings.weeklyReportEmail} onCheckedChange={(v) => update('weeklyReportEmail', v)} />
        <SettingRow label="Monthly email report" checked={settings.monthlyReportEmail} onCheckedChange={(v) => update('monthlyReportEmail', v)} />
      </SettingsSection>
    </div>
  );
}
