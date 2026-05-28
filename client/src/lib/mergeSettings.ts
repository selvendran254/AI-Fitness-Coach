import type { UserSettings } from '@ai-fitness-coach/shared';
import { DEFAULT_USER_SETTINGS } from '@ai-fitness-coach/shared';

/**
 * Merge partial settings with defaults so missing keys never crash the UI.
 */
export function mergeUserSettings(partial?: Partial<UserSettings> | null): UserSettings {
  if (!partial || typeof partial !== 'object') {
    return { ...DEFAULT_USER_SETTINGS };
  }
  return { ...DEFAULT_USER_SETTINGS, ...partial };
}
