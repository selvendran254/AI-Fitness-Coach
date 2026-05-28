import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Users, Mail, UserCircle } from 'lucide-react';

export default function CaregiverPage() {
  const [email, setEmail] = useState('');
  const qc = useQueryClient();
  const { data: patients = [] } = useQuery({
    queryKey: ['caregiver-patients'],
    queryFn: async () => (await api.get('/caregiver/patients')).data.data,
  });

  const invite = useMutation({
    mutationFn: () => api.post('/caregiver/invite', { caregiverEmail: email }),
    onSuccess: () => { setEmail(''); qc.invalidateQueries({ queryKey: ['caregiver-patients'] }); },
  });

  const list = patients as { patient: { firstName: string; lastName: string; email: string } }[];

  return (
    <div className="page-shell max-w-2xl">
      <PageHeader
        icon={Users}
        title="Family / Caregiver"
        description="Invite family to view your progress (read-only)."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Invite caregiver</CardTitle>
          <CardDescription>They receive an email to link as read-only viewer</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="family@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
          <Button onClick={() => invite.mutate()} disabled={!email} className="shrink-0">Invite</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Linked patients</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {list.map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/20">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <UserCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{p.patient.firstName} {p.patient.lastName}</p>
                <p className="text-xs text-muted-foreground">{p.patient.email}</p>
              </div>
            </div>
          ))}
          {!list.length && <p className="text-sm text-muted-foreground py-6 text-center">No active links yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
