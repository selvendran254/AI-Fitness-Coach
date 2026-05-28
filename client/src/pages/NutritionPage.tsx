import { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserSettings } from '@/hooks/useUserSettings';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FoodPhotoScan } from '@/components/nutrition/FoodPhotoScan';
import { MealCalendar } from '@/components/nutrition/MealCalendar';
import { SettingSlider } from '@/components/settings/SettingSlider';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Utensils, Flame, Beef, Wheat, Droplets, Calendar, Camera, Target } from 'lucide-react';

export default function NutritionPage() {
  const settings = useUserSettings();
  const setSettings = useSettingsStore((s) => s.setSettings);
  const [mealDesc, setMealDesc] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!mealDesc.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/nutrition/meals/analyze', { description: mealDesc });
      setAnalyzeResult(data.data);
    } catch {
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/nutrition/meal-plans/generate', {
        days: 7,
        calorieTarget: settings.dailyCalorieTarget,
      });
      alert(`Meal plan created: ${data.data.title}`);
    } catch {
      alert('Failed — check server');
    } finally {
      setLoading(false);
    }
  };

  const macroPct = {
    protein: Math.round((settings.dailyProteinTargetG * 4 / settings.dailyCalorieTarget) * 100),
    carbs: Math.round((settings.dailyCarbsTargetG * 4 / settings.dailyCalorieTarget) * 100),
    fat: Math.round((settings.dailyFatTargetG * 9 / settings.dailyCalorieTarget) * 100),
  };

  const desc = `${settings.dailyCalorieTarget} kcal · ${settings.culturalDietPreference.replace(/_/g, ' ')} · ${settings.foodDatabaseRegion}`;

  return (
    <div className="page-shell">
      <PageHeader icon={Utensils} title="Nutrition" description={desc} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Calories" value={String(settings.dailyCalorieTarget)} sub="daily target" icon={Flame} accent="orange" progress={65} />
        <StatCard label="Protein" value={`${settings.dailyProteinTargetG}`} sub="grams / day" icon={Beef} accent="teal" progress={macroPct.protein} />
        <StatCard label="Carbs" value={`${settings.dailyCarbsTargetG}`} sub="grams / day" icon={Wheat} accent="green" progress={macroPct.carbs} />
        <StatCard label="Fat" value={`${settings.dailyFatTargetG}`} sub="grams / day" icon={Flame} accent="blue" progress={macroPct.fat} />
      </div>

      <Tabs defaultValue="log">
        <div className="tabs-scroll">
          <TabsList className="flex-wrap h-auto w-max max-w-full">
            <TabsTrigger value="log">Log food</TabsTrigger>
            <TabsTrigger value="photo"><Camera className="h-3.5 w-3.5 mr-1 opacity-70" />Photo</TabsTrigger>
            <TabsTrigger value="mealplan">Meal plan</TabsTrigger>
            <TabsTrigger value="water"><Droplets className="h-3.5 w-3.5 mr-1 opacity-70" />Water</TabsTrigger>
            <TabsTrigger value="targets"><Target className="h-3.5 w-3.5 mr-1 opacity-70" />Targets</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />Calendar</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Describe your meal</CardTitle><CardDescription>Tamil or English — e.g. 2 idli, sambar</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Input value={mealDesc} onChange={(e) => setMealDesc(e.target.value)} placeholder="2 idli, sambar, coconut chutney" className="h-11" />
              <Button onClick={analyzeText} disabled={loading} size="lg">{loading ? 'Analyzing...' : 'AI Analyze'}</Button>
              {analyzeResult && (
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-sm space-y-1">
                  {Object.entries(analyzeResult as Record<string, unknown>).map(([k, v]) => (
                    <p key={k}><span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span> {String(v)}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photo"><FoodPhotoScan /></TabsContent>

        <TabsContent value="mealplan">
          <Card>
            <CardHeader>
              <CardTitle>7-day AI meal plan</CardTitle>
              <CardDescription>
                {[settings.lowSodiumMode && 'Low sodium', settings.glycemicIndexFilter && 'Low GI', settings.dietaryRestrictions.join(', ') || 'No restrictions'].filter(Boolean).join(' · ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={generateMealPlan} disabled={loading} size="lg">Generate meal plan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water">
          <Card>
            <CardHeader><CardTitle>Water intake</CardTitle><CardDescription>Glass size: {settings.glassSizeMl} ml</CardDescription></CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {[1, 2, 3, 4].map((n) => (
                <Button key={n} variant="outline" size="lg" className="rounded-xl" onClick={() => api.post('/nutrition/water', { amountMl: n * settings.glassSizeMl })}>
                  <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                  +{n} glass ({n * settings.glassSizeMl}ml)
                </Button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targets">
          <Card className="max-w-lg">
            <CardHeader><CardTitle>Daily targets</CardTitle><CardDescription>Macro split: P{macroPct.protein}% C{macroPct.carbs}% F{macroPct.fat}%</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <SettingSlider label="Calories" value={settings.dailyCalorieTarget} min={1200} max={4000} step={50} unit="kcal" onChange={(v) => setSettings({ dailyCalorieTarget: v })} />
              <SettingSlider label="Protein" value={settings.dailyProteinTargetG} min={40} max={200} unit="g" onChange={(v) => setSettings({ dailyProteinTargetG: v })} />
              <SettingSlider label="Carbs" value={settings.dailyCarbsTargetG} min={50} max={400} unit="g" onChange={(v) => setSettings({ dailyCarbsTargetG: v })} />
              <SettingSlider label="Max carbs/meal" value={settings.maxCarbsPerMealG ?? 60} min={15} max={120} unit="g" onChange={(v) => setSettings({ maxCarbsPerMealG: v })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <MealCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
