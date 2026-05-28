import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  progress?: number;
  accent?: 'teal' | 'blue' | 'orange' | 'green';
}

const accents = {
  teal: {
    icon: 'bg-primary/15 text-primary ring-2 ring-primary/20 shadow-sm shadow-primary/10',
    bar: 'bg-gradient-to-r from-primary via-emerald-500 to-teal-400',
    tint: 'stat-accent-teal',
  },
  blue: {
    icon: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20 shadow-sm shadow-blue-500/10',
    bar: 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400',
    tint: 'stat-accent-blue',
  },
  orange: {
    icon: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/20 shadow-sm shadow-orange-500/10',
    bar: 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400',
    tint: 'stat-accent-orange',
  },
  green: {
    icon: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20 shadow-sm shadow-emerald-500/10',
    bar: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400',
    tint: 'stat-accent-green',
  },
};

export function StatCard({ label, value, sub, icon: Icon, progress = 0, accent = 'teal' }: StatCardProps) {
  const pct = Math.min(100, Math.max(0, progress));
  const a = accents[accent];
  const showPct = progress > 0;

  return (
    <div className={cn('surface-card stat-card-glow relative overflow-hidden p-5 flex flex-col gap-3.5 group', a.tint)}>
      <div className={cn('absolute inset-x-0 top-0 stat-strip-glow', a.tint)} />
      <div className="flex items-start justify-between gap-3 pt-2">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          {showPct && <span className="stat-pct-badge">{Math.round(pct)}% goal</span>}
        </div>
        <div className={cn('p-3 rounded-2xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6', a.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight tabular-nums text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1.5 font-medium">{sub}</p>}
      </div>
      <div className="relative h-3.5 rounded-full bg-muted/50 overflow-hidden ring-1 ring-border/30">
        <div
          className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out', a.bar)}
          style={{ width: `${pct}%` }}
        />
        {pct > 2 && pct < 100 && <div className="absolute inset-0 rounded-full stat-bar-shimmer pointer-events-none" />}
        {pct >= 100 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white drop-shadow-sm">✓</span>
          </div>
        )}
      </div>
    </div>
  );
}
