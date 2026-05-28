import { Link, useLocation } from 'react-router-dom';
import { Droplets, Pill, Activity, Moon, Sun, MessageCircle, Zap } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { cn } from '@/lib/utils';

const pills = [
  { to: '/coach', icon: MessageCircle, label: 'Coach', highlight: true as const },
  { to: '/progress', icon: Activity, label: 'Vitals' },
  { to: '/nutrition', icon: Droplets, label: 'Water' },
  { to: '/settings', icon: Pill, label: 'Meds' },
];

export function QuickToggleBar() {
  const { pathname } = useLocation();
  const setSettings = useSettingsStore((s) => s.setSettings);
  const theme = useSettingsStore((s) => s.settings.theme);
  const large = useSettingsStore((s) => s.settings.largeText);
  const isDark = theme === 'dark';

  return (
    <div className="quick-bar-shell px-4 lg:px-8 py-3">
      <div className="flex items-center gap-3 max-w-6xl mx-auto w-full overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0 text-primary">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] hidden sm:inline">Quick</span>
        </div>

        <div className="quick-bar-track shrink-0">
          {pills.map((pill) => {
            const { to, icon: Icon, label } = pill;
            const coachHighlight = 'highlight' in pill && pill.highlight;
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shrink-0',
                  active && coachHighlight && 'quick-pill-coach-active',
                  active && !coachHighlight && 'bg-primary text-primary-foreground shadow-md',
                  !active && 'text-muted-foreground hover:text-foreground hover:bg-card/90'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="h-7 w-px bg-gradient-to-b from-transparent via-border to-transparent shrink-0 mx-1" aria-hidden />

        <div className="flex items-center gap-1.5 ml-auto shrink-0 quick-bar-track">
          <button
            type="button"
            onClick={() => setSettings({ theme: isDark ? 'light' : 'dark' })}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300',
              isDark ? 'quick-theme-dark-on' : 'text-muted-foreground hover:bg-card hover:text-foreground'
            )}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSettings({ largeText: !large })}
            className={cn(
              'px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-300',
              large
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'text-muted-foreground hover:bg-card hover:text-foreground'
            )}
            aria-label="Large text"
          >
            A+
          </button>
        </div>
      </div>
    </div>
  );
}
