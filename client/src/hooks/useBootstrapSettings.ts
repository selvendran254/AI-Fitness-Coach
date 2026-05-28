import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
/**
 * Load user settings from API after login so all pages have complete preferences.
 */
export function useBootstrapSettings() {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  const replaceSettings = useSettingsStore((s) => s.replaceSettings);

  useEffect(() => {
    if (!isAuth) return;
    api
      .get('/users/me/settings')
      .then((res) => {
        const prefs = res.data.data?.preferences;
        replaceSettings(prefs);
      })
      .catch(() => {
        /* keep defaults */
      });
  }, [isAuth, replaceSettings]);
}
