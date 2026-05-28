import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  TrendingUp,
  MessageCircle,
  Trophy,
  Settings,
  LogOut,
  Menu,
  Smartphone,
  Users,
  Heart,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useBootstrapSettings } from '@/hooks/useBootstrapSettings';
import { QuickToggleBar } from '@/components/layout/QuickToggleBar';
import { useAutoDeviceSync } from '@/hooks/useAutoDeviceSync';
import { api } from '@/lib/api';
import { flushQueue, getQueue } from '@/lib/offlineQueue';

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
      { to: '/workouts', icon: Dumbbell, key: 'workouts' },
      { to: '/nutrition', icon: Utensils, key: 'nutrition' },
      { to: '/progress', icon: TrendingUp, key: 'progress' },
      { to: '/coach', icon: MessageCircle, key: 'coach' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { to: '/devices', icon: Smartphone, key: 'devices' },
      { to: '/challenges', icon: Trophy, key: 'challenges' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/settings', icon: Settings, key: 'settings' },
      { to: '/caregiver', icon: Users, key: 'caregiver' },
    ],
  },
] as const;

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/workouts': 'workouts',
  '/nutrition': 'nutrition',
  '/progress': 'progress',
  '/coach': 'coach',
  '/devices': 'devices',
  '/challenges': 'challenges',
  '/settings': 'settings',
  '/caregiver': 'caregiver',
};

export function AppLayout() {
  useBootstrapSettings();
  useAutoDeviceSync();
  useEffect(() => {
    const id = setInterval(() => api.post('/medications/check-reminders').catch(() => {}), 60_000);
    const onOnline = () => {
      if (getQueue().length) {
        flushQueue(async (m) => {
          await api.request({ method: m.method, url: m.url, data: m.body });
        });
      }
    };
    window.addEventListener('online', onOnline);
    return () => {
      clearInterval(id);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageKey = Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1];
  const mobileTitle = pageKey ? t(`nav.${pageKey}`) : t('app.name');

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      <div className="p-5 border-b border-border/40">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-emerald-500 to-teal-600 flex items-center justify-center logo-glow">
              <Heart className="h-6 w-6 text-primary-foreground drop-shadow-sm" />
            </div>
            <span className="online-dot" aria-label="Online" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm leading-tight truncate">{t('app.name')}</h1>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
              {t('app.tagline')}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map(({ to, icon: Icon, key }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onNav}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300',
                      isActive
                        ? 'nav-pill-active'
                        : 'text-muted-foreground font-medium hover:bg-accent/80 hover:text-foreground hover:pl-4'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', isActive && 'bg-white/20')}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{t(`nav.${key}`)}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="user-card-panel m-3">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary flex items-center justify-center text-sm font-bold ring-2 ring-primary/15">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background app-mesh-bg">
      <aside className="hidden lg:flex flex-col w-[272px] shrink-0 border-r border-border/40 sidebar-panel">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[288px] sidebar-panel shadow-2xl flex flex-col app-mesh-bg">
            <div className="flex justify-between items-center p-3 border-b border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent onNav={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="glass-header lg:hidden flex items-center gap-3 px-4 h-[3.25rem]">
          <Button variant="ghost" size="icon" className="shrink-0 rounded-xl -ml-1" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shrink-0 logo-glow">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.1em] leading-none">{t('app.name')}</p>
            <p className="font-bold text-base truncate leading-tight mt-0.5">{mobileTitle}</p>
          </div>
        </header>
        <QuickToggleBar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 pb-20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
