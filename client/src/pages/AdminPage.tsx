import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Shield, Users, Dumbbell, Utensils, Trophy } from 'lucide-react';

export default function AdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="surface-card h-32 animate-pulse bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: String(data?.userCount ?? 0), icon: Users, accent: 'teal' as const },
    { label: 'Workout Logs', value: String(data?.workoutCount ?? 0), icon: Dumbbell, accent: 'green' as const },
    { label: 'Meals Logged', value: String(data?.mealCount ?? 0), icon: Utensils, accent: 'orange' as const },
    { label: 'Active Challenges', value: String(data?.activeChallenges ?? 0), icon: Trophy, accent: 'blue' as const },
  ];

  return (
    <div className="page-shell">
      <PageHeader icon={Shield} title="Admin Dashboard" description="Platform overview and usage stats" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} accent={s.accent} progress={100} />
        ))}
      </div>
    </div>
  );
}
