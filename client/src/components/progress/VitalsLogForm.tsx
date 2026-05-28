import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function VitalsLogForm() {
  const qc = useQueryClient();
  const [weight, setWeight] = useState('');
  const [glucose, setGlucose] = useState('');
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');

  const save = useMutation({
    mutationFn: () =>
      api.post('/progress/entries', {
        weightKg: parseFloat(weight) || 70,
        bloodGlucoseMgDl: glucose ? parseFloat(glucose) : undefined,
        systolicBp: sys ? parseInt(sys, 10) : undefined,
        diastolicBp: dia ? parseInt(dia, 10) : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      setGlucose(''); setSys(''); setDia('');
    },
  });

  return (
    <Card>
      <CardHeader><CardTitle>Log glucose & BP</CardTitle></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div><Label>Weight (kg)</Label><Input value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
        <div><Label>Glucose (mg/dL)</Label><Input value={glucose} onChange={(e) => setGlucose(e.target.value)} /></div>
        <div><Label>BP systolic</Label><Input value={sys} onChange={(e) => setSys(e.target.value)} /></div>
        <div><Label>BP diastolic</Label><Input value={dia} onChange={(e) => setDia(e.target.value)} /></div>
        <Button className="sm:col-span-2" onClick={() => save.mutate()} disabled={save.isPending}>Save vitals</Button>
      </CardContent>
    </Card>
  );
}
