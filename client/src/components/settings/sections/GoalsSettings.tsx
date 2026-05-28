import type { UserSettings } from '@ai-fitness-coach/shared';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingSelect } from '../SettingSelect';
import { SettingSlider } from '../SettingSlider';
import { SettingsSection } from '../SettingsSection';

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

export function GoalsSettings({ settings, update }: Props) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Primary goal" description="Drives AI workout and meal recommendations">
        <SettingSelect label="Main goal" value={settings.primaryGoal} options={[{ value: 'HEALTH_MANAGEMENT', label: 'Health management' }, { value: 'WEIGHT_LOSS', label: 'Weight loss' }, { value: 'WEIGHT_GAIN', label: 'Weight gain' }, { value: 'MAINTENANCE', label: 'Maintain weight' }, { value: 'MUSCLE_GAIN', label: 'Muscle gain' }]} onValueChange={(v) => update('primaryGoal', v as UserSettings['primaryGoal'])} />
        <SettingSelect label="Weight change pace" value={settings.weightChangeRatePerWeek} options={[{ value: 'slow', label: 'Slow (0.25 kg/week)' }, { value: 'moderate', label: 'Moderate (0.5 kg/week)' }, { value: 'fast', label: 'Fast (0.75+ kg/week)' }]} onValueChange={(v) => update('weightChangeRatePerWeek', v as UserSettings['weightChangeRatePerWeek'])} />
        <div className="py-3 space-y-2"><Label>Target weight (kg)</Label><Input type="number" value={settings.targetWeightKg ?? ''} onChange={(e) => update('targetWeightKg', Number(e.target.value) || undefined)} /></div>
      </SettingsSection>

      <SettingsSection title="Daily nutrition targets">
        <SettingSlider label="Daily calories" value={settings.dailyCalorieTarget} min={1200} max={4000} step={50} unit="kcal" onChange={(v) => update('dailyCalorieTarget', v)} />
        <SettingSlider label="Protein" value={settings.dailyProteinTargetG} min={40} max={200} unit="g" onChange={(v) => update('dailyProteinTargetG', v)} />
        <SettingSlider label="Carbohydrates" value={settings.dailyCarbsTargetG} min={50} max={400} unit="g" onChange={(v) => update('dailyCarbsTargetG', v)} />
        <SettingSlider label="Fat" value={settings.dailyFatTargetG} min={30} max={150} unit="g" onChange={(v) => update('dailyFatTargetG', v)} />
        <SettingSlider label="Fiber" value={settings.dailyFiberTargetG} min={10} max={50} unit="g" onChange={(v) => update('dailyFiberTargetG', v)} />
        <SettingSlider label="Water" value={settings.dailyWaterGoalMl} min={1000} max={5000} step={100} unit="ml" onChange={(v) => update('dailyWaterGoalMl', v)} />
      </SettingsSection>

      <SettingsSection title="Activity targets">
        <SettingSlider label="Daily steps" value={settings.dailyStepsTarget} min={2000} max={20000} step={500} onChange={(v) => update('dailyStepsTarget', v)} />
        <SettingSlider label="Workouts per week" value={settings.weeklyWorkoutGoal} min={1} max={7} onChange={(v) => update('weeklyWorkoutGoal', v)} />
        <SettingSlider label="Active minutes per week" value={settings.weeklyActiveMinutesGoal} min={60} max={600} step={15} unit="min" onChange={(v) => update('weeklyActiveMinutesGoal', v)} />
        <SettingSlider label="Sleep hours per night" value={settings.dailySleepGoalHours} min={5} max={12} step={0.5} unit="hrs" onChange={(v) => update('dailySleepGoalHours', v)} />
      </SettingsSection>
    </div>
  );
}
