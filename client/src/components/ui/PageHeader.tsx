import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon: Icon, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-6 border-b border-border/40', className)}>
      <div className="flex gap-4 min-w-0">
        {Icon && (
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/25 via-primary/10 to-transparent border border-primary/20 shadow-sm flex items-center justify-center">
            <Icon className="h-7 w-7 text-primary" />
          </div>
        )}
        <div className="space-y-1 min-w-0 pt-0.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="flex flex-wrap gap-2 shrink-0">{children}</div>}
    </div>
  );
}
