import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionTitle({ title, description, children, className }: SectionTitleProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}
