import { getDailyQuote } from '@ai-fitness-coach/shared';
import { useTranslation } from 'react-i18next';
import { Quote } from 'lucide-react';

export function DailyQuote() {
  const { i18n } = useTranslation();
  const q = getDailyQuote(i18n.language === 'ta' ? 'ta' : 'en');
  return (
    <div className="flex gap-3 rounded-2xl px-5 py-4 border border-primary/15 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
      <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5 opacity-80" />
      <p className="text-sm text-foreground/90 leading-relaxed">
        <span className="text-primary font-semibold">Today — </span>
        {q.text}
      </p>
    </div>
  );
}
