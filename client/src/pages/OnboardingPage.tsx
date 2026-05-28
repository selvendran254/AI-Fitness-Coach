import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useSettingsStore } from '@/stores/settingsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Target, Smartphone, Pill, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEP_META = [
  { icon: Heart, title: 'Welcome', desc: 'Set your daily targets — change anytime in Settings.' },
  { icon: Target, title: 'Daily goals', desc: 'Steps, water, and weekly workouts.' },
  { icon: Smartphone, title: 'Devices', desc: 'Link phone, watch, or Bluetooth band after setup.' },
  { icon: Pill, title: 'Medicine', desc: 'Enable reminders in Settings → Health.' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const setSettings = useSettingsStore((s) => s.setSettings);
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState({ steps: 8000, water: 2500, workouts: 4 });

  const finish = async () => {
    setSettings({
      dailyStepsTarget: goals.steps,
      dailyWaterGoalMl: goals.water,
      weeklyWorkoutGoal: goals.workouts,
    });
    await api.post('/onboarding/complete');
    navigate('/dashboard');
  };

  const meta = STEP_META[step];
  const Icon = meta.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 app-mesh-bg">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center gap-2">
          {STEP_META.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === step ? 'w-8 bg-primary' : i < step ? 'w-2 bg-primary/60' : 'w-2 bg-muted'
              )}
            />
          ))}
        </div>

        <Card className="elevated-card border-primary/15">
          <CardHeader className="text-center pb-2">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <Icon className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl">{meta.title}</CardTitle>
            <CardDescription>{meta.desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <Button className="w-full" size="lg" onClick={() => setStep(1)}>
                Get started <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 1 && (
              <>
                <div className="space-y-2"><Label>Steps / day</Label><Input type="number" value={goals.steps} onChange={(e) => setGoals({ ...goals, steps: +e.target.value })} /></div>
                <div className="space-y-2"><Label>Water (ml)</Label><Input type="number" value={goals.water} onChange={(e) => setGoals({ ...goals, water: +e.target.value })} /></div>
                <div className="space-y-2"><Label>Workouts / week</Label><Input type="number" value={goals.workouts} onChange={(e) => setGoals({ ...goals, workouts: +e.target.value })} /></div>
                <Button className="w-full" size="lg" onClick={() => setStep(2)}>Next</Button>
              </>
            )}
            {step === 2 && <Button className="w-full" size="lg" onClick={() => setStep(3)}>Next</Button>}
            {step === 3 && (
              <Button className="w-full" size="lg" onClick={finish}>
                Finish & go to dashboard
              </Button>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">Step {step + 1} of {STEP_META.length}</p>
      </div>
    </div>
  );
}
