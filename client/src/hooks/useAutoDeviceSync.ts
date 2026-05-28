import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuthStore } from '@/stores/authStore';

/** Auto-sync connected devices on interval (feature #11) */
export function useAutoDeviceSync() {
  const settings = useUserSettings();
  const isAuth = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    if (!isAuth || !settings.syncWithWearable) return;
    const mins = settings.syncFrequencyMinutes ?? 15;
    const ms = Math.max(5, mins) * 60 * 1000;
    const tick = () => api.post('/devices/sync-all').catch(() => {});
    tick();
    const id = setInterval(tick, ms);
    return () => clearInterval(id);
  }, [isAuth, settings.syncWithWearable, settings.syncFrequencyMinutes]);
}
