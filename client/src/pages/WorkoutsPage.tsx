import { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserSettings } from '@/hooks/useUserSettings';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingSlider } from '@/components/settings/SettingSlider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ExerciseVideos } from '@/components/workouts/ExerciseVideos';
import { WorkoutPlanView } from '@/components/workouts/WorkoutPlanView';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dumbbell, History, Sparkles, SlidersHorizontal, Video } from 'lucide-react';

export default function WorkoutsPage() {
  const settings = useUserSettings();
  const setSettings = useSettingsStore((s) => s.setSettings);
  const [plan, setPlan] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(settings.maxWorkoutDurationMinutes);
  const [goals, setGoals] = useState('');

  const generatePlan = async () => {
    setLoading(true);
    try {
      const safety = await api.post('/workouts/safety-check', {});
      const warnings = safety.data.data?.warnings as string[] | undefined;
      if (warnings?.length && !confirm(warnings.join('\n') + '\n\nContinue?')) {
        setLoading(false);
        return;
      }
      const { data } = await api.post('/workouts/generate', {
        durationMinutes: duration,
        equipment: settings.equipmentAvailable,
        goals: goals || settings.primaryGoal.replace(/_/g, ' ').toLowerCase(),
      });
      setPlan(data.data);
    } catch {
      alert('Failed to generate plan. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const meta = `${(settings.trainingStyle ?? 'full_body').replace(/_/g, ' ')} · ${settings.fitnessLevel} · ${(settings.preferredWorkoutDays ?? []).length} days/week`;

  return (
    <div className="page-shell">
      <PageHeader icon={Dumbbell} title="Workouts" description={meta} />

      <Tabs defaultValue="generate">
        <div className="tabs-scroll">
          <TabsList className="w-max min-w-full sm:min-w-0">
            <TabsTrigger value="generate"><Sparkles className="h-3.5 w-3.5 mr-1.5 opacity-70" />AI Plan</TabsTrigger>
            <TabsTrigger value="quick"><SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 opacity-70" />Quick</TabsTrigger>
            <TabsTrigger value="history"><History className="h-3.5 w-3.5 mr-1.5 opacity-70" />History</TabsTrigger>
            <TabsTrigger value="videos"><Video className="h-3.5 w-3.5 mr-1.5 opacity-70" />Videos</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Generate workout plan</CardTitle>
                <CardDescription>Safe for your health profile — uses all your settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingSlider label="Duration" value={duration} min={settings.minWorkoutDurationMinutes} max={settings.maxWorkoutDurationMinutes} unit="min" onChange={setDuration} />
                <div className="space-y-2">
                  <Label>Session focus (optional)</Label>
                  <Input value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="e.g. upper body, light cardio" />
                </div>
                <Button onClick={generatePlan} disabled={loading} className="w-full" size="lg">
                  {loading ? 'Generating with AI...' : 'Generate AI Workout Plan'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Active preferences</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-3">
                {[
                  `Warmup ${settings.warmupDurationMinutes} min · Cooldown ${settings.cooldownDurationMinutes} min`,
                  `Rest ${settings.restBetweenSetsSeconds}s sets / ${settings.restBetweenExercisesSeconds}s exercises`,
                  `Equipment: ${settings.equipmentAvailable.length ? settings.equipmentAvailable.join(', ') : 'Bodyweight'}`,
                  `Cardio: ${settings.preferredCardioTypes.join(', ') || 'Any'}`,
                ].map((line) => (
                  <p key={line} className="text-muted-foreground py-2 border-b border-border/40 last:border-0">{line}</p>
                ))}
                {settings.physiotherapyMode && (
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/15 text-primary">Physiotherapy mode ON</span>
                )}
              </CardContent>
            </Card>
          </div>

          {plan && (
            <Card className="border-primary/20 shadow-md">
              <CardHeader><CardTitle>Your plan</CardTitle></CardHeader>
              <CardContent>
                <WorkoutPlanView plan={plan} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quick">
          <Card className="max-w-xl">
            <CardHeader><CardTitle>Session overrides</CardTitle><CardDescription>One-time changes without going to Settings</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <SettingSlider label="Today's duration" value={duration} min={10} max={90} unit="min" onChange={setDuration} />
              <SettingSlider label="Rest between sets" value={settings.restBetweenSetsSeconds} min={30} max={180} step={15} unit="sec" onChange={(v) => setSettings({ restBetweenSetsSeconds: v })} />
              <Button variant="outline" onClick={() => setSettings({ physiotherapyMode: !settings.physiotherapyMode })}>
                Physio mode: {settings.physiotherapyMode ? 'ON' : 'OFF'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <EmptyState icon={History} title="No workouts logged yet" description="Complete a session and it will appear here." />
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <ExerciseVideos />
        </TabsContent>
      </Tabs>
    </div>
  );
}
