import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hydrated = useAuthHydrated();
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && isAuth) navigate('/dashboard', { replace: true });
  }, [hydrated, isAuth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = data.data;
      setAuth(accessToken, refreshToken, user);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-emerald-600 to-teal-800 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" aria-hidden />
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Heart className="h-7 w-7" />
          </div>
          <span className="text-xl font-semibold">{t('app.name')}</span>
        </div>
        <div className="space-y-4 max-w-md relative z-10">
          <h2 className="text-3xl font-semibold leading-tight">{t('app.tagline')}</h2>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            Safe workouts, meal tracking, vitals & AI coaching — English and Tamil.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60 relative z-10">Demo: demo@fitcoach.demo / Demo@12345</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 app-mesh-bg">
        <Card className="elevated-card w-full max-w-md">
          <CardHeader className="space-y-1 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-2">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t('auth.login')}</CardTitle>
            <CardDescription>{t('app.tagline')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Signing in…' : t('auth.login')}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
              <p>
                No account?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  {t('auth.register')}
                </Link>
              </p>
              <Link to="/forgot-password" className="text-primary font-medium hover:underline block">
                Forgot password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
