import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Flame, Droplets } from 'lucide-react';

export function StreakBadges() {
  const { data } = useQuery({
    queryKey: ['streaks'],
    queryFn: async () => (await api.get('/streaks')).data.data as {
      waterStreak: number;
      workoutStreak: number;
      badges: string[];
    },
  });
  if (!data) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" className="gap-1"><Droplets className="h-3 w-3" /> Water {data.waterStreak}d</Badge>
      <Badge variant="secondary" className="gap-1"><Flame className="h-3 w-3" /> Workout {data.workoutStreak}d</Badge>
      {data.badges.map((b) => <Badge key={b}>{b.replace('_', ' ')}</Badge>)}
    </div>
  );
}
