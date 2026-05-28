import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LayoutDashboard } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressChart } from '@/components/progress/ProgressChart';
import { DailyQuote } from '@/components/dashboard/DailyQuote';
import { StreakBadges } from '@/components/dashboard/StreakBadges';
import {
  Activity, Droplets, Flame, Footprints, Dumbbell, Utensils, MessageCircle, TrendingUp, AlertTriangle, Smartphone, Sparkles,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAutoDeviceSync } from '@/hooks/useAutoDeviceSync';

type Summary = {
  stats: {
    caloriesToday: number;
    calorieTarget: number;
    waterMlToday: number;
    waterGoalMl: number;
    glassMl: number;
    stepsToday: number;
    stepsTarget: number;
    workoutsThisWeek: number;
    weeklyWorkoutGoal: number;
  };
  vitals: {
    glucose?: number;
    systolicBp?: number;
    diastolicBp?: number;
    sleepHours?: number;
    heartRate?: number;
  };
  chart: { date: string; weight: number; glucose?: number }[];
  connectedDevices: number;
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const s = useUserSettings();
  useAutoDeviceSync();

  const { data: summary } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/dashboard/summary')).data.data as Summary,
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return (res.data.data as { type: string; body: string }[]).filter((n) => n.type === 'health_alert').slice(0, 3);
    },
  });

  const st = summary?.stats;
  const v = summary?.vitals;

  return (
    <div className="page-shell">
      <PageHeader
        icon={LayoutDashboard}
        title={`${t('dashboard.welcome')}, ${user?.firstName ?? 'User'}`}
        description={t('app.tagline')}
      >
        <Button variant="outline" size="sm" asChild>
          <Link to="/settings">Settings</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => api.post(`/ai/weekly-summary?lang=${s.aiCoachLanguage === 'ta' ? 'ta' : 'en'}`).then(() => alert('Weekly summary ready'))}>
          <Sparkles className="h-4 w-4 mr-1" />
          Summary
        </Button>
        <Button size="sm" asChild>
          <Link to="/coach">AI Coach</Link>
        </Button>
      </PageHeader>

      <div className="space-y-3">
        <DailyQuote />
        <StreakBadges />
      </div>

      {alerts.map((a, i) => (
        <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p>{a.body}</p>
        </div>
      ))}

      {st && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t('dashboard.calories')} value={`${st.caloriesToday}`} sub={`/ ${st.calorieTarget} kcal`} icon={Flame} progress={(st.caloriesToday / st.calorieTarget) * 100} accent="orange" />
          <StatCard label={t('dashboard.water')} value={`${Math.round(st.waterMlToday / st.glassMl)}`} sub={`/ ${Math.round(st.waterGoalMl / st.glassMl)} glasses`} icon={Droplets} progress={(st.waterMlToday / st.waterGoalMl) * 100} accent="blue" />
          <StatCard label={t('dashboard.steps')} value={st.stepsToday.toLocaleString()} sub={`/ ${st.stepsTarget.toLocaleString()}`} icon={Footprints} progress={(st.stepsToday / st.stepsTarget) * 100} accent="green" />
          <StatCard label={t('dashboard.todayWorkout')} value={`${Math.max(0, st.weeklyWorkoutGoal - st.workoutsThisWeek)}`} sub="left this week" icon={Activity} progress={(st.workoutsThisWeek / st.weeklyWorkoutGoal) * 100} accent="teal" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly progress</CardTitle>
            <CardDescription>Weight & glucose from your logs</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChart data={summary?.chart?.length ? summary.chart : []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s vitals</CardTitle>
            <CardDescription>Latest readings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Glucose', value: v?.glucose?.toString() ?? '—', unit: s.bloodGlucoseUnit },
              { label: 'Blood pressure', value: v?.systolicBp ? `${v.systolicBp}/${v.diastolicBp ?? '—'}` : '—', unit: 'mmHg' },
              { label: 'Sleep', value: v?.sleepHours?.toFixed(1) ?? '—', unit: 'hrs' },
              { label: 'Heart rate', value: v?.heartRate?.toString() ?? '—', unit: 'bpm' },
            ].map((m) => (
              <div key={m.label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                <span className="text-sm text-muted-foreground">{m.label}</span>
                <span className="text-sm font-semibold tabular-nums">
                  {m.value} <span className="text-muted-foreground font-normal">{m.unit}</span>
                </span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
              <Link to="/progress">Log vitals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <SectionTitle title="Quick actions" description="Jump to your daily tools" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { to: '/workouts', icon: Dumbbell, label: 'Workouts', desc: 'Plans & videos' },
              { to: '/nutrition', icon: Utensils, label: 'Nutrition', desc: 'Meals & water' },
              { to: '/coach', icon: MessageCircle, label: 'AI Coach', desc: 'Ask anything' },
              { to: '/progress', icon: TrendingUp, label: 'Progress', desc: 'BP & glucose' },
              { to: '/devices', icon: Smartphone, label: 'Devices', desc: summary?.connectedDevices ? `${summary.connectedDevices} linked` : 'Connect' },
            ].map(({ to, icon: Icon, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/40 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
