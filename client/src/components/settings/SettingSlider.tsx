import { Label } from '@/components/ui/label';

interface SettingSliderProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function SettingSlider({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: SettingSliderProps) {
  return (
    <div className="space-y-2 py-3">
      <div className="flex justify-between">
        <div>
          <Label>{label}</Label>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <span className="text-sm font-medium tabular-nums">
          {value}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit ? ` ${unit}` : ''}</span>
        <span>{max}{unit ? ` ${unit}` : ''}</span>
      </div>
    </div>
  );
}
