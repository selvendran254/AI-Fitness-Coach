import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { AppLayout } from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import WorkoutsPage from '@/pages/WorkoutsPage';
import NutritionPage from '@/pages/NutritionPage';
import ProgressPage from '@/pages/ProgressPage';
import CoachPage from '@/pages/CoachPage';
import ChallengesPage from '@/pages/ChallengesPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminPage from '@/pages/AdminPage';
import DevicesPage from '@/pages/DevicesPage';
import DevicesOAuthCompletePage from '@/pages/DevicesOAuthCompletePage';
import OnboardingPage from '@/pages/OnboardingPage';
import CaregiverPage from '@/pages/CaregiverPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import { OnboardingGuard } from '@/components/OnboardingGuard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthHydrated();
  const isAuth = useAuthStore((s) => s.isAuthenticated());

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/devices/oauth-complete" element={<DevicesOAuthCompletePage />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <OnboardingGuard>
              <AppLayout />
            </OnboardingGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="workouts" element={<WorkoutsPage />} />
        <Route path="nutrition" element={<NutritionPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="coach" element={<CoachPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="caregiver" element={<CaregiverPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
