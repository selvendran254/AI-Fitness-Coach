import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SettingChipsProps {
  label: string;
  description?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function SettingChips({ label, description, options, selected, onChange }: SettingChipsProps) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]
    );
  };

  return (
    <div className="space-y-2 py-3">
      <Label>{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Button
            key={opt}
            type="button"
            size="sm"
            variant={selected.includes(opt) ? 'default' : 'outline'}
            className={cn('capitalize')}
            onClick={() => toggle(opt)}
          >
            {opt.replace(/_/g, ' ')}
          </Button>
        ))}
      </div>
    </div>
  );
}
