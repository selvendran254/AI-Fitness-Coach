import type { UserSettings } from '@ai-fitness-coach/shared';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingSelect } from '../SettingSelect';
import { SettingRow } from '../SettingRow';
import { SettingSlider } from '../SettingSlider';
import { SettingChips } from '../SettingChips';
import { SettingsSection } from '../SettingsSection';

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

const CONDITIONS = ['DIABETES_TYPE1', 'DIABETES_TYPE2', 'HYPERTENSION', 'PREDIABETES', 'NONE'];

export function HealthSettings({ settings, update }: Props) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Health conditions & profile" description="Critical for safe AI coaching">
        <SettingChips label="Health conditions" options={CONDITIONS} selected={settings.healthConditions} onChange={(v) => update('healthConditions', v as UserSettings['healthConditions'])} />
        <div className="py-3 space-y-2">
          <Label>Allergies (comma-separated)</Label>
          <Input value={settings.allergies.join(', ')} onChange={(e) => update('allergies', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="peanuts, shellfish" />
        </div>
        <div className="py-3 space-y-2">
          <Label>Current medications</Label>
          <Input value={settings.currentMedications.join(', ')} onChange={(e) => update('currentMedications', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="Metformin, Lisinopril" />
        </div>
        <SettingRow label="Insulin dependent" checked={settings.insulinDependent} onCheckedChange={(v) => update('insulinDependent', v)} />
        <SettingSelect label="Insulin type" value={settings.insulinType} options={[{ value: 'none', label: 'None' }, { value: 'rapid', label: 'Rapid-acting' }, { value: 'long_acting', label: 'Long-acting' }, { value: 'mixed', label: 'Mixed' }, { value: 'pump', label: 'Insulin pump' }]} onValueChange={(v) => update('insulinType', v as UserSettings['insulinType'])} />
        <SettingRow label="Carb counting" checked={settings.carbCountingEnabled} onCheckedChange={(v) => update('carbCountingEnabled', v)} />
        <SettingRow label="Prefer low GI foods" checked={settings.lowGIPreference} onCheckedChange={(v) => update('lowGIPreference', v)} />
        <SettingRow label="Avoid high-intensity cardio" checked={settings.avoidHighIntensityCardio} onCheckedChange={(v) => update('avoidHighIntensityCardio', v)} />
      </SettingsSection>

      <SettingsSection title="Blood glucose targets" description="Used for alerts and AI recommendations">
        <SettingSelect label="Glucose unit" value={settings.bloodGlucoseUnit} options={[{ value: 'mg/dL', label: 'mg/dL' }, { value: 'mmol/L', label: 'mmol/L' }]} onValueChange={(v) => update('bloodGlucoseUnit', v as 'mg/dL' | 'mmol/L')} />
        <SettingSlider label="Fasting glucose target" value={settings.targetFastingGlucose ?? 100} min={70} max={130} unit={settings.bloodGlucoseUnit} onChange={(v) => update('targetFastingGlucose', v)} />
        <SettingSlider label="Post-meal glucose target" value={settings.targetPostMealGlucose ?? 140} min={100} max={200} unit={settings.bloodGlucoseUnit} onChange={(v) => update('targetPostMealGlucose', v)} />
        <SettingSlider label="Hypoglycemia alert below" value={settings.hypoglycemiaThreshold ?? 70} min={50} max={80} unit={settings.bloodGlucoseUnit} onChange={(v) => update('hypoglycemiaThreshold', v)} />
        <SettingSlider label="Hyperglycemia alert above" value={settings.hyperglycemiaThreshold ?? 250} min={180} max={400} unit={settings.bloodGlucoseUnit} onChange={(v) => update('hyperglycemiaThreshold', v)} />
        <SettingSlider label="HbA1c target %" value={settings.hba1cTarget ?? 7} min={5} max={10} step={0.1} onChange={(v) => update('hba1cTarget', v)} />
        <SettingRow label="Insulin-to-carb ratio tracking" description="Units per 15g carbs" checked={settings.carbCountingEnabled} onCheckedChange={(v) => update('carbCountingEnabled', v)} />
        <div className="grid grid-cols-2 gap-4 py-3">
          <div className="space-y-2"><Label>Insulin:carb ratio</Label><Input type="number" step="0.5" value={settings.insulinToCarbRatio ?? ''} onChange={(e) => update('insulinToCarbRatio', Number(e.target.value) || undefined)} placeholder="1:10" /></div>
          <div className="space-y-2"><Label>Correction factor</Label><Input type="number" value={settings.correctionFactor ?? ''} onChange={(e) => update('correctionFactor', Number(e.target.value) || undefined)} /></div>
        </div>
      </SettingsSection>

      <SettingsSection title="Blood pressure & heart" description="Hypertension-safe exercise limits">
        <SettingRow label="BP monitoring enabled" checked={settings.bpMonitoringEnabled} onCheckedChange={(v) => update('bpMonitoringEnabled', v)} />
        <SettingSlider label="Target systolic BP" value={settings.targetSystolicBp ?? 120} min={90} max={140} unit="mmHg" onChange={(v) => update('targetSystolicBp', v)} />
        <SettingSlider label="Target diastolic BP" value={settings.targetDiastolicBp ?? 80} min={60} max={90} unit="mmHg" onChange={(v) => update('targetDiastolicBp', v)} />
        <SettingSlider label="Resting heart rate" value={settings.restingHeartRate ?? 72} min={40} max={100} unit="bpm" onChange={(v) => update('restingHeartRate', v)} />
        <SettingSlider label="Max heart rate cap (% of max HR)" value={settings.heartRateCapPercent} min={50} max={90} unit="%" onChange={(v) => update('heartRateCapPercent', v)} />
        <SettingRow label="Heart rate zone training" checked={settings.heartRateZoneTraining} onCheckedChange={(v) => update('heartRateZoneTraining', v)} />
      </SettingsSection>

      <SettingsSection title="Nutrition limits (medical)">
        <SettingSlider label="Max daily sodium" value={settings.maxDailySodiumMg ?? 2300} min={1000} max={3000} step={100} unit="mg" onChange={(v) => update('maxDailySodiumMg', v)} />
        <SettingSlider label="Max carbs per meal" value={settings.maxCarbsPerMealG ?? 60} min={15} max={120} unit="g" onChange={(v) => update('maxCarbsPerMealG', v)} />
        <SettingSlider label="Max daily potassium" value={settings.maxDailyPotassiumMg ?? 3500} min={2000} max={5000} step={100} unit="mg" onChange={(v) => update('maxDailyPotassiumMg', v)} />
        <SettingRow label="Low sodium mode" checked={settings.lowSodiumMode} onCheckedChange={(v) => update('lowSodiumMode', v)} />
      </SettingsSection>

      <SettingsSection title="Care reminders">
        <SettingRow label="Medication reminders" checked={settings.medicationReminders} onCheckedChange={(v) => update('medicationReminders', v)} />
        <SettingRow label="Diabetic foot care reminders" checked={settings.footCareReminders} onCheckedChange={(v) => update('footCareReminders', v)} />
        <SettingRow label="Eye exam reminders" checked={settings.eyeExamReminders} onCheckedChange={(v) => update('eyeExamReminders', v)} />
        <SettingRow label="Annual checkup reminder" checked={settings.annualCheckupReminder} onCheckedChange={(v) => update('annualCheckupReminder', v)} />
        <div className="grid grid-cols-2 gap-4 py-3">
          <div className="space-y-2"><Label>Doctor name</Label><Input value={settings.doctorName ?? ''} onChange={(e) => update('doctorName', e.target.value)} /></div>
          <div className="space-y-2"><Label>Doctor phone</Label><Input value={settings.doctorPhone ?? ''} onChange={(e) => update('doctorPhone', e.target.value)} /></div>
        </div>
        <div className="py-3 space-y-2"><Label>Medical ID notes</Label><Input value={settings.medicalIdNotes ?? ''} onChange={(e) => update('medicalIdNotes', e.target.value)} placeholder="ICE info for emergencies" /></div>
      </SettingsSection>
    </div>
  );
}
