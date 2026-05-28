import type { UserSettings } from '@ai-fitness-coach/shared';
import { SettingSelect } from '../SettingSelect';
import { SettingRow } from '../SettingRow';
import { SettingsSection } from '../SettingsSection';

type Props = {
  settings: UserSettings;
  update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  t: (key: string) => string;
};

export function GeneralSettings({ settings, update, t }: Props) {
  return (
    <SettingsSection title={t('settings.general')} description="Language, appearance, and app behavior">
      <SettingSelect label={t('settings.language')} value={settings.language} options={[{ value: 'en', label: 'English' }, { value: 'ta', label: 'தமிழ் (Tamil)' }]} onValueChange={(v) => update('language', v as 'en' | 'ta')} />
      <SettingSelect label={t('settings.theme')} value={settings.theme} options={[{ value: 'light', label: t('settings.themeLight') }, { value: 'dark', label: t('settings.themeDark') }, { value: 'system', label: t('settings.themeSystem') }]} onValueChange={(v) => update('theme', v as UserSettings['theme'])} />
      <SettingSelect label="Font size" value={settings.fontSize} options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }, { value: 'xlarge', label: 'Extra Large' }]} onValueChange={(v) => update('fontSize', v as UserSettings['fontSize'])} />
      <SettingSelect label="Card density" value={settings.cardDensity} options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfortable' }, { value: 'spacious', label: 'Spacious' }]} onValueChange={(v) => update('cardDensity', v as UserSettings['cardDensity'])} />
      <SettingSelect label={t('settings.unitSystem')} value={settings.unitSystem} options={[{ value: 'metric', label: t('settings.metric') }, { value: 'imperial', label: t('settings.imperial') }]} onValueChange={(v) => update('unitSystem', v as 'metric' | 'imperial')} />
      <SettingSelect label="Date format" value={settings.dateFormat} options={[{ value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }]} onValueChange={(v) => update('dateFormat', v as UserSettings['dateFormat'])} />
      <SettingSelect label="Time format" value={settings.timeFormat} options={[{ value: '12h', label: '12-hour' }, { value: '24h', label: '24-hour' }]} onValueChange={(v) => update('timeFormat', v as '12h' | '24h')} />
      <SettingSelect label="First day of week" value={settings.firstDayOfWeek} options={[{ value: 'sunday', label: 'Sunday' }, { value: 'monday', label: 'Monday' }]} onValueChange={(v) => update('firstDayOfWeek', v as UserSettings['firstDayOfWeek'])} />
      <SettingSelect label="App opens to" value={settings.startupPage} options={[{ value: 'dashboard', label: 'Dashboard' }, { value: 'workouts', label: 'Workouts' }, { value: 'nutrition', label: 'Nutrition' }, { value: 'coach', label: 'AI Coach' }, { value: 'last', label: 'Last visited page' }]} onValueChange={(v) => update('startupPage', v as UserSettings['startupPage'])} />
      <SettingRow label="Compact mode" description="Smaller spacing throughout the app" checked={settings.compactMode} onCheckedChange={(v) => update('compactMode', v)} />
      <SettingRow label="Welcome banner" checked={settings.showWelcomeBanner} onCheckedChange={(v) => update('showWelcomeBanner', v)} />
      <SettingRow label="Animations" checked={settings.animationsEnabled} onCheckedChange={(v) => update('animationsEnabled', v)} />
      <SettingRow label="Sound effects" checked={settings.soundEffects} onCheckedChange={(v) => update('soundEffects', v)} />
      <SettingRow label="Haptic feedback" description="Vibration on mobile devices" checked={settings.hapticFeedback} onCheckedChange={(v) => update('hapticFeedback', v)} />
    </SettingsSection>
  );
}
