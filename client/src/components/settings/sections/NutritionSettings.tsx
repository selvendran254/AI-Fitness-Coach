import type { UserSettings } from '@ai-fitness-coach/shared';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingSelect } from '../SettingSelect';
import { SettingRow } from '../SettingRow';
import { SettingChips } from '../SettingChips';
import { SettingsSection } from '../SettingsSection';

const RESTRICTIONS = ['vegetarian', 'vegan', 'jain', 'halal', 'gluten_free', 'dairy_free', 'low_sodium', 'low_carb', 'egg_free'];

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

export function NutritionSettings({ settings, update }: Props) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Diet preferences">
        <SettingChips label="Dietary restrictions" options={RESTRICTIONS} selected={settings.dietaryRestrictions} onChange={(v) => update('dietaryRestrictions', v)} />
        <SettingSelect label="Food database region" value={settings.foodDatabaseRegion} options={[{ value: 'india', label: 'India' }, { value: 'us', label: 'United States' }, { value: 'uk', label: 'UK' }, { value: 'global', label: 'Global' }]} onValueChange={(v) => update('foodDatabaseRegion', v as UserSettings['foodDatabaseRegion'])} />
        <SettingSelect label="Cultural diet (AI meals)" value={settings.culturalDietPreference} options={[{ value: 'tamil_traditional', label: 'Tamil traditional' }, { value: 'south_indian', label: 'South Indian' }, { value: 'north_indian', label: 'North Indian' }, { value: 'general', label: 'General' }, { value: 'western', label: 'Western' }]} onValueChange={(v) => update('culturalDietPreference', v as UserSettings['culturalDietPreference'])} />
        <SettingRow label="Glycemic index filter" checked={settings.glycemicIndexFilter} onCheckedChange={(v) => update('glycemicIndexFilter', v)} />
        <SettingRow label="Low sodium mode" checked={settings.lowSodiumMode} onCheckedChange={(v) => update('lowSodiumMode', v)} />
        <SettingRow label="Regional Tamil/Indian food DB" checked={settings.regionalFoodDatabase} onCheckedChange={(v) => update('regionalFoodDatabase', v)} />
      </SettingsSection>

      <SettingsSection title="Meal tracking">
        <SettingRow label="Meal reminders" checked={settings.mealReminders} onCheckedChange={(v) => update('mealReminders', v)} />
        <SettingRow label="Snack tracking" checked={settings.snackTrackingEnabled} onCheckedChange={(v) => update('snackTrackingEnabled', v)} />
        <SettingRow label="Meal prep mode" checked={settings.mealPrepMode} onCheckedChange={(v) => update('mealPrepMode', v)} />
        <SettingRow label="Barcode scanner" checked={settings.barcodeScannerEnabled} onCheckedChange={(v) => update('barcodeScannerEnabled', v)} />
        <SettingRow label="AI recipe suggestions" checked={settings.recipeSuggestionsEnabled} onCheckedChange={(v) => update('recipeSuggestionsEnabled', v)} />
        <SettingSelect label="Portion size guide" value={settings.portionSizeGuide} options={[{ value: 'hand', label: 'Hand method' }, { value: 'scale', label: 'Kitchen scale' }, { value: 'both', label: 'Both' }]} onValueChange={(v) => update('portionSizeGuide', v as UserSettings['portionSizeGuide'])} />
        <div className="grid grid-cols-3 gap-4 py-3">
          {(['breakfastReminderTime', 'lunchReminderTime', 'dinnerReminderTime'] as const).map((key) => (
            <div key={key} className="space-y-2"><Label>{key.replace('ReminderTime', '')}</Label><Input type="time" value={settings[key] ?? ''} onChange={(e) => update(key, e.target.value)} /></div>
          ))}
        </div>
        <SettingSelect label="Cheat meal day" value={String(settings.cheatMealDay ?? '')} options={[{ value: '', label: 'None' }, ...['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => ({ value: String(i), label: d }))]} onValueChange={(v) => update('cheatMealDay', v === '' ? undefined : Number(v))} />
      </SettingsSection>

      <SettingsSection title="Intermittent fasting">
        <SettingRow label="Enable fasting window" checked={settings.intermittentFastingEnabled} onCheckedChange={(v) => update('intermittentFastingEnabled', v)} />
        <div className="grid grid-cols-2 gap-4 py-3">
          <div className="space-y-2"><Label>Fasting starts</Label><Input type="time" value={settings.fastingWindowStart ?? ''} onChange={(e) => update('fastingWindowStart', e.target.value)} disabled={!settings.intermittentFastingEnabled} /></div>
          <div className="space-y-2"><Label>Fasting ends</Label><Input type="time" value={settings.fastingWindowEnd ?? ''} onChange={(e) => update('fastingWindowEnd', e.target.value)} disabled={!settings.intermittentFastingEnabled} /></div>
        </div>
      </SettingsSection>

      <SettingsSection title="Diabetes-specific">
        <SettingRow label="Pre-meal walk reminder (10 min)" checked={settings.preMealWalkReminder} onCheckedChange={(v) => update('preMealWalkReminder', v)} />
        <SettingRow label="Post-meal glucose log reminder" checked={settings.postMealGlucoseLogReminder} onCheckedChange={(v) => update('postMealGlucoseLogReminder', v)} />
        <SettingRow label="Track alcohol" checked={settings.alcoholTracking} onCheckedChange={(v) => update('alcoholTracking', v)} />
        <SettingRow label="Track caffeine" checked={settings.caffeineTracking} onCheckedChange={(v) => update('caffeineTracking', v)} />
        <SettingRow label="Track supplements" checked={settings.supplementTracking} onCheckedChange={(v) => update('supplementTracking', v)} />
      </SettingsSection>
    </div>
  );
}
