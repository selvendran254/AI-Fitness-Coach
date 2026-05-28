import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { exportToCsv, exportToPdf } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChart } from '@/components/progress/ProgressChart';
import { VitalsLogForm } from '@/components/progress/VitalsLogForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  const { data: entries = [] } = useQuery({
    queryKey: ['progress-entries'],
    queryFn: async () => {
      const res = await api.get('/progress/entries');
      return res.data.data as Array<{
        recordedAt: string;
        weightKg: number;
        bloodGlucoseMgDl?: number;
      }>;
    },
  });

  const chartData = entries.map((e) => ({
    date: new Date(e.recordedAt).toLocaleDateString(),
    weight: e.weightKg,
    glucose: e.bloodGlucoseMgDl,
  }));

  const handleExportCsv = () => {
    exportToCsv('progress-export.csv', entries as unknown as Record<string, unknown>[]);
  };

  const handleExportPdf = () => {
    exportToPdf('Progress Report', JSON.stringify(entries, null, 2));
  };

  const handleDoctorPdf = async () => {
    const res = await api.get('/reports/doctor?days=30');
    exportToPdf('Doctor Report — AI Fitness Coach', JSON.stringify(res.data.data, null, 2));
  };

  return (
    <div className="page-shell">
      <PageHeader icon={TrendingUp} title="Progress" description="Track weight, glucose, blood pressure and export reports">
        <Button variant="outline" size="sm" onClick={handleDoctorPdf}>Doctor PDF</Button>
        <Button variant="outline" size="sm" onClick={handleExportCsv}>CSV</Button>
        <Button variant="outline" size="sm" onClick={handleExportPdf}>PDF</Button>
      </PageHeader>
      <VitalsLogForm />
      <Card>
        <CardHeader><CardTitle>Body Metrics & BMI</CardTitle></CardHeader>
        <CardContent>
          <ProgressChart data={chartData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Sleep Tracker</CardTitle></CardHeader>
        <CardContent className="text-muted-foreground">Log sleep duration and quality.</CardContent>
      </Card>
    </div>
  );
}
