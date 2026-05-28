import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserSettings } from '@/hooks/useUserSettings';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SettingSelect } from '@/components/settings/SettingSelect';
import { SettingRow } from '@/components/settings/SettingRow';
import { Users, Footprints, Droplets, Dumbbell, Flame, Trophy } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

const CHALLENGE_TYPES = [
  { id: 'STEPS', label: 'Steps', icon: Footprints, unit: 'steps' },
  { id: 'WORKOUTS', label: 'Workouts', icon: Dumbbell, unit: 'sessions' },
  { id: 'WATER', label: 'Water', icon: Droplets, unit: 'ml' },
  { id: 'CALORIES', label: 'Calories burned', icon: Flame, unit: 'kcal' },
];

export default function ChallengesPage() {
  const settings = useUserSettings();
  const setSettings = useSettingsStore((s) => s.setSettings);
  const qc = useQueryClient();
  const [title, setTitle] = useState('Weekly steps');
  const [target, setTarget] = useState(50000);

  const createChallenge = useMutation({
    mutationFn: () =>
      api.post('/challenges', {
        title,
        type: 'STEPS',
        targetValue: target,
        unit: 'steps',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['challenges'] }),
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await api.get('/challenges/leaderboard');
      return res.data.data as Array<{ displayName: string; score: number; rank: number }>;
    },
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const res = await api.get('/challenges');
      return res.data.data ?? [];
    },
  });

  return (
    <div className="page-shell">
      <PageHeader
        icon={Trophy}
        title="Challenges"
        description="Compete with friends — steps, workouts, water & more"
      />

      <Tabs defaultValue="active">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="active">Active challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="create">Create challenge</TabsTrigger>
          <TabsTrigger value="prefs">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {CHALLENGE_TYPES.map(({ id, label, icon: Icon, unit }) => (
              <Card key={id}>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{label} challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Join a {unit}-based challenge with friends</p>
                  <Button variant="outline" size="sm">Find {label} challenge</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {Array.isArray(challenges) && challenges.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Your active challenges</CardTitle></CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(challenges, null, 2)}</pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Global leaderboard</CardTitle>
              <CardDescription>
                {settings.showOnLeaderboard ? 'You are visible on the leaderboard' : 'Hidden — enable in Preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <p className="text-muted-foreground text-sm">No rankings yet. Join a challenge to compete!</p>
              ) : (
                <ul className="space-y-2">
                  {leaderboard.map((entry) => (
                    <li key={entry.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="font-medium">#{entry.rank} {entry.displayName}</span>
                      <Badge>{entry.score} pts</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create custom challenge</CardTitle>
              <CardDescription>Set duration, target, and invite friends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <input className="border rounded px-3 py-2 w-full text-sm" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge title" />
              <input className="border rounded px-3 py-2 w-full text-sm" type="number" value={target} onChange={(e) => setTarget(+e.target.value)} placeholder="Target steps" />
              <SettingSelect
                label="Challenge type"
                value="STEPS"
                options={CHALLENGE_TYPES.map((c) => ({ value: c.id, label: c.label }))}
                onValueChange={() => {}}
              />
              <Button onClick={() => createChallenge.mutate()} disabled={createChallenge.isPending}>
                Create challenge
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prefs">
          <Card>
            <CardHeader><CardTitle>Social preferences</CardTitle></CardHeader>
            <CardContent className="divide-y">
              <SettingRow label="Show on leaderboard" checked={settings.showOnLeaderboard} onCheckedChange={(v) => setSettings({ showOnLeaderboard: v })} />
              <SettingRow label="Share progress with friends" checked={settings.shareProgressWithFriends} onCheckedChange={(v) => setSettings({ shareProgressWithFriends: v })} />
              <SettingRow label="Share workout history" checked={settings.shareWorkoutHistory} onCheckedChange={(v) => setSettings({ shareWorkoutHistory: v })} />
              <SettingRow label="Challenge update notifications" checked={settings.challengeUpdates} onCheckedChange={(v) => setSettings({ challengeUpdates: v })} />
              <SettingRow label="Streak notifications" checked={settings.streakNotifications} onCheckedChange={(v) => setSettings({ streakNotifications: v })} />
              <SettingRow label="Achievement badges" checked={settings.achievementBadges} onCheckedChange={(v) => setSettings({ achievementBadges: v })} />
              <SettingSelect
                label="Profile visibility"
                value={settings.profileVisibility}
                options={[{ value: 'public', label: 'Public' }, { value: 'friends', label: 'Friends' }, { value: 'private', label: 'Private' }]}
                onValueChange={(v) => setSettings({ profileVisibility: v as typeof settings.profileVisibility })}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
