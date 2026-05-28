import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MealCalendar() {
  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => (await api.get('/nutrition/meals')).data.data as { loggedAt: string; name: string; mealType: string }[],
  });

  const byDay = meals.reduce<Record<string, typeof meals>>((acc, m) => {
    const d = new Date(m.loggedAt).toLocaleDateString();
    (acc[d] ??= []).push(m);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader><CardTitle>7-day meal calendar</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(byDay).slice(0, 7).map(([day, items]) => (
          <div key={day} className="border-b pb-2">
            <p className="font-medium text-sm">{day}</p>
            {items.map((m, i) => (
              <p key={i} className="text-xs text-muted-foreground">{m.mealType}: {m.name}</p>
            ))}
          </div>
        ))}
        {!meals.length && <p className="text-sm text-muted-foreground">Log meals to see calendar.</p>}
      </CardContent>
    </Card>
  );
}
