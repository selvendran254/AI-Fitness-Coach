/// <reference lib="dom" />
import { useCallback, useState } from 'react';

type SpeechRecognitionCtor = new () => {
  lang: string;
  continuous: boolean;
  onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};

/** Tamil/English voice input + read-aloud for AI coach (#5) */
export function useVoiceCoach(language: 'en' | 'ta' = 'en') {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(() => {
    const w = window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    rec.continuous = false;
    rec.onresult = (e) => {
      setTranscript(e.results[0]?.[0]?.transcript ?? '');
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }, [language]);

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
      window.speechSynthesis.speak(u);
    },
    [language]
  );

  return { listening, transcript, setTranscript, startListening, speak };
}
