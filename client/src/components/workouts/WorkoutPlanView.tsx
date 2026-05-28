import { Dumbbell, Clock, AlertTriangle, Flame, Wind } from 'lucide-react';

type Exercise = { name?: string; sets?: number; reps?: string; duration?: string; notes?: string };
type Plan = {
  title?: string;
  durationMinutes?: number;
  warmup?: string | Exercise[];
  exercises?: Exercise[];
  cooldown?: string | Exercise[];
  safetyNotes?: string[];
  warnings?: string[];
};

export function WorkoutPlanView({ plan }: { plan: object }) {
  const p = plan as Plan;
  const exercises = p.exercises ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-transparent border border-primary/15">
        <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
          <Flame className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{p.title ?? 'Your workout'}</h3>
          {p.durationMinutes != null && (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <Clock className="h-3.5 w-3.5" />
              {p.durationMinutes} minutes total
            </span>
          )}
        </div>
      </div>

      {(p.safetyNotes?.length ?? p.warnings?.length) ? (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-4 space-y-2">
          <p className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            Safety notes
          </p>
          {[...(p.safetyNotes ?? []), ...(p.warnings ?? [])].map((n, i) => (
            <p key={i} className="text-sm text-muted-foreground pl-6">{n}</p>
          ))}
        </div>
      ) : null}

      {exercises.length > 0 ? (
        <ol className="space-y-3">
          {exercises.map((ex, i) => (
            <li
              key={i}
              className="flex gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/25 hover:shadow-md transition-all"
            >
              <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{ex.name ?? `Exercise ${i + 1}`}</p>
                <p className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-2 gap-y-1">
                  {ex.sets != null && <span className="inline-flex items-center gap-1"><Dumbbell className="h-3 w-3" />{ex.sets} sets</span>}
                  {ex.reps && <span>{ex.reps} reps</span>}
                  {ex.duration && <span>{ex.duration}</span>}
                </p>
                {ex.notes && <p className="text-xs text-muted-foreground mt-2 italic">{ex.notes}</p>}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <pre className="text-xs overflow-auto bg-muted/40 p-4 rounded-2xl max-h-64 border border-border/40 font-mono">
          {JSON.stringify(plan, null, 2)}
        </pre>
      )}

      {(p.warmup || p.cooldown) && (
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {p.warmup && (
            <div className="p-3 rounded-xl border border-border/50 bg-muted/30 flex gap-2">
              <Wind className="h-4 w-4 text-primary shrink-0" />
              <div><span className="font-medium">Warmup</span><p className="text-muted-foreground text-xs mt-0.5">{typeof p.warmup === 'string' ? p.warmup : 'See plan'}</p></div>
            </div>
          )}
          {p.cooldown && (
            <div className="p-3 rounded-xl border border-border/50 bg-muted/30 flex gap-2">
              <Wind className="h-4 w-4 text-blue-500 shrink-0" />
              <div><span className="font-medium">Cooldown</span><p className="text-muted-foreground text-xs mt-0.5">{typeof p.cooldown === 'string' ? p.cooldown : 'See plan'}</p></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
