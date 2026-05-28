import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState<boolean | null>(null);
  const loc = useLocation();

  useEffect(() => {
    api.get('/users/me').then((r) => {
      setDone(!!r.data.data?.onboardingCompleted);
    }).catch(() => setDone(true));
  }, []);

  if (done === null) return <p className="p-6 text-muted-foreground">Loading...</p>;
  if (!done && loc.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
