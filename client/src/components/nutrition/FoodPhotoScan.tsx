import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Food photo upload for AI calorie/macro estimation.
 */
export function FoodPhotoScan() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const { data } = await api.post('/nutrition/meals/analyze', { imageBase64: base64 });
        const analysis = data.data as { name?: string; items?: unknown[]; totalMacros?: { calories?: number; protein?: number; carbs?: number; fat?: number } };
        setResult(analysis);
        if (analysis.name && analysis.totalMacros) {
          await api.post('/nutrition/meals', {
            name: analysis.name,
            mealType: 'LUNCH',
            items: analysis.items ?? [],
            totalMacros: analysis.totalMacros,
            aiAnalyzed: true,
          });
        }
      } catch {
        alert('Analysis failed');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Photo Scan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={loading}>
          {loading ? 'Analyzing...' : 'Upload Food Photo'}
        </Button>
        {result && (
          <p className="text-sm text-green-700 dark:text-green-400">Saved to meal log — {(result as { name?: string }).name}</p>
        )}
      </CardContent>
    </Card>
  );
}
