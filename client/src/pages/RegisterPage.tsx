import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    preferredLanguage: 'en',
    healthConditions: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 app-mesh-bg">
      <Card className="elevated-card w-full max-w-lg ring-1 ring-primary/5">
        <CardHeader>
          <CardTitle>{t('auth.register')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('auth.email')}</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>{t('auth.password')}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.language')}</Label>
              <Select value={form.preferredLanguage} onValueChange={(v) => setForm({ ...form, preferredLanguage: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Health conditions (optional)</Label>
              <Select
                onValueChange={(v) => {
                  if (!form.healthConditions.includes(v)) {
                    setForm({ ...form, healthConditions: [...form.healthConditions, v] });
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="Add condition" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIABETES_TYPE2">Type 2 Diabetes</SelectItem>
                  <SelectItem value="HYPERTENSION">Hypertension</SelectItem>
                  <SelectItem value="PREDIABETES">Prediabetes</SelectItem>
                </SelectContent>
              </Select>
              {form.healthConditions.length > 0 && (
                <p className="text-sm text-muted-foreground">{form.healthConditions.join(', ')}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{t('auth.register')}</Button>
          </form>
          <p className="text-center text-sm mt-4">
            <Link to="/login" className="text-primary hover:underline">{t('auth.login')}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
