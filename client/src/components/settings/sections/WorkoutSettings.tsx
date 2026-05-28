import type { UserSettings } from '@ai-fitness-coach/shared';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SettingSelect } from '../SettingSelect';
import { SettingRow } from '../SettingRow';
import { SettingSlider } from '../SettingSlider';
import { SettingChips } from '../SettingChips';
import { SettingsSection } from '../SettingsSection';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CARDIO = ['walking', 'cycling', 'swimming', 'elliptical', 'rowing', 'dancing', 'yoga'];
const FOCUS = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'full_body'];
const EQUIPMENT = ['dumbbells', 'barbell', 'resistance_bands', 'kettlebell', 'treadmill', 'bike', 'pull_up_bar', 'bench', 'none'];

type Props = {
  settings: UserSettings;
  update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  toggleDay: (day: number) => void;
};

export function WorkoutSettings({ settings, update, toggleDay }: Props) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Schedule & duration">
        <div className="py-3">
          <Label className="mb-2 block">Preferred workout days</Label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((name, i) => (
              <Button key={name} size="sm" variant={settings.preferredWorkoutDays.includes(i) ? 'default' : 'outline'} onClick={() => toggleDay(i)}>{name}</Button>
            ))}
          </div>
        </div>
        <SettingSelect label="Preferred time" value={settings.preferredWorkoutTime} options={[{ value: 'morning', label: 'Morning (6–10 AM)' }, { value: 'afternoon', label: 'Afternoon' }, { value: 'evening', label: 'Evening' }, { value: 'flexible', label: 'Flexible' }]} onValueChange={(v) => update('preferredWorkoutTime', v as UserSettings['preferredWorkoutTime'])} />
        <SettingSelect label="Fitness level" value={settings.fitnessLevel} options={[{ value: 'BEGINNER', label: 'Beginner' }, { value: 'INTERMEDIATE', label: 'Intermediate' }, { value: 'ADVANCED', label: 'Advanced' }]} onValueChange={(v) => update('fitnessLevel', v as UserSettings['fitnessLevel'])} />
        <SettingSlider label="Min workout duration" value={settings.minWorkoutDurationMinutes} min={10} max={60} unit="min" onChange={(v) => update('minWorkoutDurationMinutes', v)} />
        <SettingSlider label="Max workout duration" value={settings.maxWorkoutDurationMinutes} min={15} max={120} unit="min" onChange={(v) => update('maxWorkoutDurationMinutes', v)} />
      </SettingsSection>

      <SettingsSection title="Training style">
        <SettingSelect label="Program style" value={settings.trainingStyle} options={[{ value: 'full_body', label: 'Full body' }, { value: 'split', label: 'Bro split' }, { value: 'push_pull_legs', label: 'Push/Pull/Legs' }, { value: 'upper_lower', label: 'Upper/Lower' }, { value: 'cardio_focus', label: 'Cardio focus' }, { value: 'custom', label: 'Custom' }]} onValueChange={(v) => update('trainingStyle', v as UserSettings['trainingStyle'])} />
        <SettingChips label="Cardio types you enjoy" options={CARDIO} selected={settings.preferredCardioTypes} onChange={(v) => update('preferredCardioTypes', v)} />
        <SettingChips label="Strength focus areas" options={FOCUS} selected={settings.strengthFocusAreas} onChange={(v) => update('strengthFocusAreas', v)} />
        <SettingChips label="Available equipment" options={EQUIPMENT} selected={settings.equipmentAvailable} onChange={(v) => update('equipmentAvailable', v)} />
        <div className="py-3 space-y-2"><Label>Excluded exercises</Label><Input value={settings.excludedExercises.join(', ')} onChange={(e) => update('excludedExercises', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="burpees, jump squats" /></div>
      </SettingsSection>

      <SettingsSection title="Rest & progression">
        <SettingSlider label="Rest between sets" value={settings.restBetweenSetsSeconds} min={30} max={180} step={15} unit="sec" onChange={(v) => update('restBetweenSetsSeconds', v)} />
        <SettingSlider label="Rest between exercises" value={settings.restBetweenExercisesSeconds} min={45} max={300} step={15} unit="sec" onChange={(v) => update('restBetweenExercisesSeconds', v)} />
        <SettingSlider label="Warmup duration" value={settings.warmupDurationMinutes} min={3} max={20} unit="min" onChange={(v) => update('warmupDurationMinutes', v)} />
        <SettingSlider label="Cooldown duration" value={settings.cooldownDurationMinutes} min={3} max={15} unit="min" onChange={(v) => update('cooldownDurationMinutes', v)} />
        <SettingRow label="Include warmup & cooldown" checked={settings.includeWarmupCooldown} onCheckedChange={(v) => update('includeWarmupCooldown', v)} />
        <SettingRow label="Auto progression" description="AI increases difficulty over time" checked={settings.autoProgression} onCheckedChange={(v) => update('autoProgression', v)} />
        <SettingRow label="Deload week" description="Lighter week every 4–6 weeks" checked={settings.deloadWeekEnabled} onCheckedChange={(v) => update('deloadWeekEnabled', v)} />
        <SettingRow label="RPE tracking" description="Rate of perceived exertion 1–10" checked={settings.rpeTrackingEnabled} onCheckedChange={(v) => update('rpeTrackingEnabled', v)} />
      </SettingsSection>

      <SettingsSection title="Experience">
        <SettingRow label="Home workout only" checked={settings.homeWorkoutOnly} onCheckedChange={(v) => update('homeWorkoutOnly', v)} />
        <SettingRow label="Physiotherapy / rehab mode" checked={settings.physiotherapyMode} onCheckedChange={(v) => update('physiotherapyMode', v)} />
        <SettingRow label="Post-workout stretch" checked={settings.postWorkoutStretch} onCheckedChange={(v) => update('postWorkoutStretch', v)} />
        <SettingRow label="Voice coaching during workout" checked={settings.voiceCoachingDuringWorkout} onCheckedChange={(v) => update('voiceCoachingDuringWorkout', v)} />
        <SettingRow label="Music during workout" checked={settings.musicDuringWorkout} onCheckedChange={(v) => update('musicDuringWorkout', v)} />
        <SettingSelect label="Exercise video quality" value={settings.exerciseVideoQuality} options={[{ value: 'low', label: 'Low (save data)' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} onValueChange={(v) => update('exerciseVideoQuality', v as UserSettings['exerciseVideoQuality'])} />
        <SettingSelect label="Rep counting" value={settings.repCountingMode} options={[{ value: 'manual', label: 'Manual' }, { value: 'auto', label: 'Auto (camera)' }, { value: 'both', label: 'Both' }]} onValueChange={(v) => update('repCountingMode', v as UserSettings['repCountingMode'])} />
      </SettingsSection>
    </div>
  );
}
