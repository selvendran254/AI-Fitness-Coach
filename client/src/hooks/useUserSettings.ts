import { useSettingsStore } from '@/stores/settingsStore';
import { mergeUserSettings } from '@/lib/mergeSettings';
import type { UserSettings } from '@ai-fitness-coach/shared';

/**
 * Always returns fully merged settings (never missing keys from old DB data).
 */
export function useUserSettings(): UserSettings {
  const settings = useSettingsStore((s) => s.settings);
  return mergeUserSettings(settings);
}
