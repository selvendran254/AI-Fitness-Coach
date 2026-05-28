import { EXERCISE_VIDEOS } from '@ai-fitness-coach/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserSettings } from '@/hooks/useUserSettings';

export function ExerciseVideos() {
  const s = useUserSettings();
  const lang = s.aiCoachLanguage === 'ta' ? 'ta' : 'en';
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {EXERCISE_VIDEOS.map((ex) => (
        <Card key={ex.id}>
          <CardHeader><CardTitle className="text-base">{lang === 'ta' ? ex.nameTa : ex.name}</CardTitle></CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                title={ex.name}
                src={ex.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{ex.durationMin} min · Safe for diabetes & BP</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
