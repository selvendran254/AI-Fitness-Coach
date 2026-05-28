import { create } from 'zustand';
import type { UserSettings } from '@ai-fitness-coach/shared';
import { mergeUserSettings } from '@/lib/mergeSettings';

interface SettingsState {
  settings: UserSettings;
  isDirty: boolean;
  setSettings: (partial: Partial<UserSettings>) => void;
  replaceSettings: (partial?: Partial<UserSettings>) => void;
  resetSettings: () => void;
  markClean: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: mergeUserSettings(),
  isDirty: false,
  setSettings: (partial) =>
    set((s) => ({
      settings: mergeUserSettings({ ...s.settings, ...partial }),
      isDirty: true,
    })),
  replaceSettings: (partial) =>
    set({ settings: mergeUserSettings(partial), isDirty: false }),
  resetSettings: () => set({ settings: mergeUserSettings(), isDirty: false }),
  markClean: () => set({ isDirty: false }),
}));
