import type { UserSettings } from '@ai-fitness-coach/shared';
import { SettingSelect } from '../SettingSelect';
import { SettingRow } from '../SettingRow';
import { SettingsSection } from '../SettingsSection';

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

export function AccessibilitySettings({ settings, update }: Props) {
  return (
    <SettingsSection title="Accessibility" description="Make the app easier to use for everyone">
      <SettingRow label="Reduced motion" checked={settings.reducedMotion} onCheckedChange={(v) => update('reducedMotion', v)} />
      <SettingRow label="Large text" checked={settings.largeText} onCheckedChange={(v) => update('largeText', v)} />
      <SettingRow label="High contrast" checked={settings.highContrast} onCheckedChange={(v) => update('highContrast', v)} />
      <SettingSelect label="Color blind mode" value={settings.colorBlindMode} options={[{ value: 'none', label: 'None' }, { value: 'protanopia', label: 'Protanopia' }, { value: 'deuteranopia', label: 'Deuteranopia' }, { value: 'tritanopia', label: 'Tritanopia' }]} onValueChange={(v) => update('colorBlindMode', v as UserSettings['colorBlindMode'])} />
      <SettingRow label="Dyslexia-friendly font" checked={settings.dyslexiaFriendlyFont} onCheckedChange={(v) => update('dyslexiaFriendlyFont', v)} />
      <SettingRow label="Screen reader optimized" checked={settings.screenReaderOptimized} onCheckedChange={(v) => update('screenReaderOptimized', v)} />
      <SettingRow label="Larger touch targets" checked={settings.minimumTouchTarget} onCheckedChange={(v) => update('minimumTouchTarget', v)} />
      <SettingRow label="Captions on exercise videos" checked={settings.captionsOnVideos} onCheckedChange={(v) => update('captionsOnVideos', v)} />
    </SettingsSection>
  );
}
