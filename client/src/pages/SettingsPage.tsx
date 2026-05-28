import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserSettings } from '@/hooks/useUserSettings';
import type { UserSettings } from '@ai-fitness-coach/shared';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { GeneralSettings } from '@/components/settings/sections/GeneralSettings';
import { HealthSettings } from '@/components/settings/sections/HealthSettings';
import { GoalsSettings } from '@/components/settings/sections/GoalsSettings';
import { WorkoutSettings } from '@/components/settings/sections/WorkoutSettings';
import { NutritionSettings } from '@/components/settings/sections/NutritionSettings';
import { SleepTrackerSettings } from '@/components/settings/sections/SleepTrackerSettings';
import { NotificationsSettings } from '@/components/settings/sections/NotificationsSettings';
import { PrivacySettings } from '@/components/settings/sections/PrivacySettings';
import { AiCoachSettings } from '@/components/settings/sections/AiCoachSettings';
import { AccessibilitySettings } from '@/components/settings/sections/AccessibilitySettings';
import { AdvancedSettings } from '@/components/settings/sections/AdvancedSettings';
import { useApplySettings } from '@/hooks/useApplySettings';
import { PageHeader } from '@/components/ui/PageHeader';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'general', labelKey: 'settings.general' },
  { id: 'health', labelKey: 'settings.health' },
  { id: 'goals', labelKey: 'settings.goals' },
  { id: 'workout', labelKey: 'settings.workout' },
  { id: 'nutrition', labelKey: 'settings.nutrition' },
  { id: 'sleep', labelKey: 'settings.sleep' },
  { id: 'notifications', labelKey: 'settings.notifications' },
  { id: 'privacy', labelKey: 'settings.privacy' },
  { id: 'ai', labelKey: 'settings.ai' },
  { id: 'accessibility', labelKey: 'settings.accessibility' },
  { id: 'advanced', labelKey: 'settings.advanced' },
] as const;

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { setSettings, replaceSettings, isDirty, markClean } = useSettingsStore();
  const settings = useUserSettings();
  useApplySettings();

  useEffect(() => {
    api.get('/users/me/settings').then((res) => {
      const prefs = res.data.data?.preferences;
      if (prefs) replaceSettings(prefs);
    }).catch(() => {});
  }, [replaceSettings]);

  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings({ [key]: value });
  };

  const toggleDay = (day: number) => {
    const days = settings.preferredWorkoutDays.includes(day)
      ? settings.preferredWorkoutDays.filter((d) => d !== day)
      : [...settings.preferredWorkoutDays, day].sort();
    update('preferredWorkoutDays', days);
  };

  const handleSave = async () => {
    await api.patch('/users/me/settings', { preferences: settings });
    if (settings.language !== i18n.language) {
      i18n.changeLanguage(settings.language);
      localStorage.setItem('language', settings.language);
    }
    markClean();
  };

  const optionCount = Object.keys(settings).length;

  return (
    <div className="page-shell max-w-5xl pb-24">
      <PageHeader
        icon={Settings}
        title={t('settings.title')}
        description={`${optionCount}+ options for diabetes & BP safe fitness`}
      >
        <div className="flex flex-wrap gap-1.5">
          {['Health', 'Workout', 'Nutrition', 'AI', 'TA/EN'].map((b) => (
            <Badge key={b} variant="secondary" className="rounded-full text-[10px]">{b}</Badge>
          ))}
        </div>
      </PageHeader>

      <Tabs defaultValue="general" className="w-full">
        <div className="tabs-scroll sticky top-0 z-[5] bg-background/90 backdrop-blur-sm py-2 -mx-1 px-1">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1.5 w-max max-w-full">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs sm:text-sm">
              {t(tab.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
        </div>

        <TabsContent value="general"><GeneralSettings settings={settings} update={update} t={t} /></TabsContent>
        <TabsContent value="health"><HealthSettings settings={settings} update={update} /></TabsContent>
        <TabsContent value="goals"><GoalsSettings settings={settings} update={update} /></TabsContent>
        <TabsContent value="workout"><WorkoutSettings settings={settings} update={update} toggleDay={toggleDay} /></TabsContent>
        <TabsContent value="nutrition"><NutritionSettings settings={settings} update={update} /></TabsContent>
        <TabsContent value="sleep"><SleepTrackerSettings settings={settings} update={update} /></TabsContent>
        <TabsContent value="notifications"><NotificationsSettings settings={settings} update={update} /></TabsContent>
        <TabsContent value="privacy"><PrivacySettings settings={settings} update={update} /></TabsContent>
        <TabsContent value="ai"><AiCoachSettings settings={settings} update={update} /></TabsContent>
        <TabsContent value="accessibility"><AccessibilitySettings settings={settings} update={update} /></TabsContent>
        <TabsContent value="advanced"><AdvancedSettings settings={settings} update={update} /></TabsContent>
      </Tabs>

      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 lg:left-[268px] z-20 p-4 border-t border-primary/20 bg-card/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.08)] transition-transform',
          isDirty ? 'translate-y-0' : 'translate-y-full lg:translate-y-0 lg:opacity-0 lg:pointer-events-none'
        )}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground hidden sm:block">
            {isDirty ? 'You have unsaved changes' : 'All changes saved'}
          </p>
          <Button onClick={handleSave} disabled={!isDirty} size="lg" className="w-full sm:w-auto ml-auto">
            {isDirty ? t('settings.save') : '✓ Saved'}
          </Button>
        </div>
      </div>
    </div>
  );
}
