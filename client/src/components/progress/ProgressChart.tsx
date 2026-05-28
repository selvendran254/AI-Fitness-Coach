import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  weight: number;
  glucose?: number;
}

interface ProgressChartProps {
  data: DataPoint[];
}

/**
 * Weight and glucose progress chart.
 */
export function ProgressChart({ data }: ProgressChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No progress data yet. Log your first entry.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" name="Weight (kg)" />
        {data.some((d) => d.glucose) && (
          <Line type="monotone" dataKey="glucose" stroke="#f97316" name="Glucose (mg/dL)" />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
