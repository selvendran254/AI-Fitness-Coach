import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Option {
  value: string;
  label: string;
}

interface SettingSelectProps {
  label: string;
  description?: string;
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
}

/**
 * Reusable select row for settings panels.
 */
export function SettingSelect({ label, description, value, options, onValueChange }: SettingSelectProps) {
  return (
    <div className="space-y-2 py-3">
      <Label>{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
